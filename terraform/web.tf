module "cloudfront_to_origin_bucket_access_policy" {
  source  = "cloudposse/iam-policy/aws"
  version = "2.0.1"
  context = module.s3_label.context
  enabled = true

  iam_policy = [{
    statements = [
      {
        sid     = "S3GetObjectForCloudFront"
        effect  = "Allow"
        actions = ["s3:GetObject"]
        resources = [
          "${module.cdn_origin_bucket.bucket_arn}/${local.website_content_origin_path}/*",
          "${module.cdn_origin_bucket.bucket_arn}/${local.website_config_object_key}",
        ]
        principals = [
          {
            type        = "AWS"
            identifiers = [aws_cloudfront_origin_access_identity.default.iam_arn]
          },
        ]
      },
      {
        sid       = "S3ListBucketForCloudFront"
        effect    = "Allow"
        actions   = ["s3:ListBucket"]
        resources = [module.cdn_origin_bucket.bucket_arn]
        principals = [
          {
            type        = "AWS"
            identifiers = [aws_cloudfront_origin_access_identity.default.iam_arn]
          },
        ]
      }
    ]
  }]
}

module "cdn_origin_bucket" {
  source  = "cloudposse/s3-bucket/aws"
  version = "4.0.1"
  context = module.s3_label.context
  name    = "origin"

  acl                          = "private"
  versioning_enabled           = true
  sse_algorithm                = "AES256"
  allow_ssl_requests_only      = true
  allow_encrypted_uploads_only = true
  source_policy_documents = [
    module.cloudfront_to_origin_bucket_access_policy.json,
  ]

  lifecycle_configuration_rules = [
    {
      enabled                                = true
      id                                     = "rule-1"
      filter_and                             = null
      abort_incomplete_multipart_upload_days = 1
      expiration                             = null
      transition                             = null
      noncurrent_version_expiration          = { noncurrent_days = 7 }
      noncurrent_version_transition          = null
    }
  ]
}

module "cdn_logs_bucket" {
  source  = "cloudposse/s3-bucket/aws"
  version = "4.0.1"
  context = module.s3_label.context
  name    = "cdn-logs"

  versioning_enabled           = var.log_bucket_versioning
  sse_algorithm                = "AES256"
  allow_ssl_requests_only      = true
  allow_encrypted_uploads_only = true

  # See https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/AccessLogs.html
  s3_object_ownership = "BucketOwnerPreferred"
  acl                 = null
  grants = [
    {
      # Canonical ID for the awslogsdelivery account
      id          = "c4c1ede66af53448b93c283ce9448c4ba468c9432aa01d700d3878632f77d2d0"
      permissions = ["FULL_CONTROL"]
      type        = "CanonicalUser"
      uri         = null
    }
  ]

  lifecycle_configuration_rules = [
    {
      enabled                                = true
      id                                     = "rule-1"
      filter_and                             = null
      abort_incomplete_multipart_upload_days = 7
      transition = [
        {
          days          = 30
          storage_class = "STANDARD_IA"
        },
        {
          days          = 60
          storage_class = "GLACIER"
        },
      ]
      expiration = {
        days = 90
      }
      noncurrent_version_transition = [
        {
          noncurrent_days = 30
          storage_class   = "GLACIER"
        },
      ]
      noncurrent_version_expiration = {
        noncurrent_days = 90
      }
    }
  ]
}

resource "aws_cloudfront_origin_access_identity" "default" {
  comment = "CPF Reporter website access."
}

data "aws_cloudfront_cache_policy" "Managed-CachingOptimized" {
  name = "Managed-CachingOptimized"
}

locals {
  website_content_origin_path = "dist"
  website_config_origin_path  = "config"
  website_config_object_key   = "${local.website_config_origin_path}/deploy-config.js"
  website_config_object_contents = templatefile("${path.module}/tpl/deploy-config.js.tftpl", {
    feature_flags = jsonencode(var.website_feature_flags),
    web_config_params = jsonencode(var.website_config_params),
  })
  website_origin_artifacts_dist_path = coalesce(
    var.website_origin_artifacts_dist_path,
    "${path.module}/../web/dist"
  )

  extension_mime_types = {
    bmp    = "image/bmp"
    css    = "text/css"
    csv    = "text/csv"
    gif    = "image/gif"
    htm    = "text/html"
    html   = "text/html"
    ico    = "image/vnd.microsoft.icon"
    jpeg   = "image/jpeg"
    jpg    = "image/jpeg"
    js     = "text/javascript"
    json   = "application/json"
    jsonld = "application/ld+json"
    otf    = "font/otf"
    pdf    = "application/pdf"
    png    = "image/png"
    svg    = "image/svg+xml"
    tif    = "image/tiff"
    tiff   = "image/tiff"
    ttf    = "font/ttf"
    txt    = "text/plain"
    woff   = "font/woff"
    woff2  = "font/woff2"
    xls    = "application/vnd.ms-excel"
    xlsx   = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    xml    = "application/xml"
    webp   = "image/webp"
  }
}

resource "aws_s3_object" "website_deploy_config" {
  key                    = local.website_config_object_key
  bucket                 = module.cdn_origin_bucket.bucket_id
  content                = local.website_config_object_contents
  etag                   = md5(local.website_config_object_contents)
  source_hash            = md5(local.website_config_object_contents)
  server_side_encryption = "AES256"
  content_type           = "text/javascript"

  depends_on = [module.cdn_origin_bucket]
}

resource "aws_s3_object" "origin_dist_artifact" {
  for_each = fileset(local.website_origin_artifacts_dist_path, "**")

  bucket                 = module.cdn_origin_bucket.bucket_id
  key                    = "${local.website_content_origin_path}/${each.value}"
  source                 = "${local.website_origin_artifacts_dist_path}/${each.value}"
  source_hash            = filemd5("${local.website_origin_artifacts_dist_path}/${each.value}")
  etag                   = filemd5("${local.website_origin_artifacts_dist_path}/${each.value}")
  server_side_encryption = "AES256"
  content_type           = local.extension_mime_types[reverse(split(".", each.value))[0]]

  depends_on = [module.cdn_origin_bucket]
}

module "cdn" {
  source              = "terraform-aws-modules/cloudfront/aws"
  version             = "3.2.1"
  create_distribution = true

  depends_on = [
    module.cdn_origin_bucket,
    module.cdn_logs_bucket,
    module.cloudfront_ssl_certificate,
  ]

  comment             = "CPF Reporter website CDN."
  enabled             = true
  aliases             = [var.website_domain_name]
  default_root_object = "index.html"

  // Optimized for North America
  // See https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PriceClass.html
  price_class = "PriceClass_100"

  logging_config = {
    bucket = module.cdn_logs_bucket.bucket_domain_name
  }

  create_origin_access_identity = false

  custom_error_response = [
    {
      error_code         = 404
      response_code      = 200
      response_page_path = "/index.html"
    },
  ]

  origin = {
    content = {
      domain_name = module.cdn_origin_bucket.bucket_domain_name
      origin_path = "/${local.website_content_origin_path}"
      s3_origin_config = {
        cloudfront_access_identity_path = aws_cloudfront_origin_access_identity.default.cloudfront_access_identity_path
      }
    }

    config = {
      domain_name = module.cdn_origin_bucket.bucket_domain_name
      origin_path = "/${local.website_config_origin_path}"
      s3_origin_config = {
        cloudfront_access_identity_path = aws_cloudfront_origin_access_identity.default.cloudfront_access_identity_path
      }
    }
  }

  default_cache_behavior = {
    target_origin_id       = "content"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods      = ["GET", "HEAD", "OPTIONS"]
    cached_methods       = ["GET", "HEAD"]
    compress             = true
    cache_policy_id      = data.aws_cloudfront_cache_policy.Managed-CachingOptimized.id
    use_forwarded_values = false

    // See https://github.com/aws-samples/amazon-cloudfront-functions/tree/main/url-rewrite-single-page-apps
    function_association = {}
  }

  ordered_cache_behavior = [
    {
      path_pattern           = "/${aws_s3_object.website_deploy_config.key}"
      target_origin_id       = local.website_config_origin_path
      viewer_protocol_policy = "redirect-to-https"

      allowed_methods      = ["GET", "HEAD", "OPTIONS"]
      cached_methods       = ["GET", "HEAD"]
      compress             = true
      cache_policy_id      = data.aws_cloudfront_cache_policy.Managed-CachingOptimized.id
      use_forwarded_values = false
    },
  ]

  viewer_certificate = {
    acm_certificate_arn      = module.cloudfront_ssl_certificate.arn
    minimum_protocol_version = "TLSv1.2_2021"
    ssl_support_method       = "sni-only"
  }
}

resource "aws_route53_record" "cdn_alias" {
  zone_id = data.aws_ssm_parameter.public_dns_zone_id.value
  name    = var.website_domain_name
  type    = "A"

  alias {
    name                   = module.cdn.cloudfront_distribution_domain_name
    zone_id                = module.cdn.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

module "cloudfront_ssl_certificate" {
  source  = "cloudposse/acm-request-certificate/aws"
  version = "0.17.0"
  context = module.this.context
  providers = {
    # CloudFront SSL certificates must be managed in us-east-1
    aws = aws.us-east-1
  }

  domain_name                       = var.website_domain_name
  zone_id                           = data.aws_ssm_parameter.public_dns_zone_id.value
  process_domain_validation_options = true
  wait_for_certificate_issued       = true
}
