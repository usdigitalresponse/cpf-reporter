output "web_cloudfront_distribution_id" {
  description = "The ID of the CloudFront distribution serving the web app."
  value       = module.cdn.cloudfront_distribution_id
}
