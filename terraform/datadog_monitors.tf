locals {
  dd_monitor_default_evaluation_delay = 900
  dd_monitor_name_prefix              = trimspace("CPF Reporter ${local.datadog_draft_label}")
  dd_monitor_default_tags = [
    "service:cpf-reporter",
    "env:${var.environment}",
    "team:grants",
  ]
  dd_monitor_default_notify = join(" ", [
    for v in var.datadog_monitor_notification_handles : "@${v}"
  ])
}

resource "datadog_monitor" "example_replace_me_with_something_useful" {
  count = var.datadog_monitors_enabled ? 1 : 0

  name = "${local.dd_monitor_name_prefix}: A specific problem was detected"
  type = "metric alert"
  message = join("\n", [
    "{{#is_alert}}",
    "Alert: Here is a brief description regarding the nature of the problem.",
    "It may be useful to indicate follow-up actions (e.g. something should be re-run) also.",
    "Anything about whether/when a monitor will auto-resolve is also appreciated.",
    "{{/is_alert}}",
    "{{#is_recovery}}",
    "Recovery: Explain why the problem is considered resolved (e.g. gremlins are now dry).",
    "{{/is_recovery}}",
    "Notify: ${local.dd_monitor_default_notify}",
  ])

  query = "min(last_1h):avg:aws.sqs.approximate_number_of_messages_visible{${join(",", [
    "env:${var.environment}",
    "queuename:TheSQSQueueName",
  ])}} > 0"

  notify_no_data   = false
  evaluation_delay = local.dd_monitor_default_evaluation_delay
  tags             = local.dd_monitor_default_tags
}
