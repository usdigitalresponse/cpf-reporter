import chevron


def generate_email_html_given_body(title: str, body_html: str) -> str:
    with open("src/static/email_templates/formatted_body.html") as g:
        email_body = chevron.render(
            g,
            {
                "body_title": "Hello,",
                "body_detail": body_html,
            },
        )
        with open("src/static/email_templates/base.html") as f:
            email_html = chevron.render(
                f,
                {
                    "tool_name": "CPF",
                    "title": title,
                    "preheader": False,
                    "webview_available": False,
                    "base_url_safe": "",
                    "usdr_logo_url": "https://grants.usdigitalresponse.org/usdr_logo_transparent.png",
                    "notifications_url_safe": False,
                },
                partials_dict={
                    "email_body": email_body,
                },
            )
            return email_html
