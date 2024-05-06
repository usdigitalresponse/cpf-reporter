output "web_cloudfront_distribution_id" {
  description = "The ID of the CloudFront distribution serving the web app."
  value       = var.is_localstack ? "" : module.cdn[0].cloudfront_distribution_id
}
