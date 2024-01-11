# Tips for Resolving QA Check Failures

The QA checks that run against open pull requests exist to help ensure that changes submitted in PRs are working properly and are consistent with our adopted best practices.
If you have encountered a QA check failure and are unsure of how to resolve it, then this guide is for you!

As always, you can reach out to the Grants team for help if you are still not sure about the best way to resolve a particular problem.

## Linting Failures

> [!TIP]
> All ESLint and TFLint findings will result in a check annotation on the relevent line(s) in your pull request's code.
> You can review them from the "Files changed" view for your PR.

### ESLint

The [ESLint](https://eslint.org/) QA check determines whether JavaScript and/or TypeScript files beneath the `api/src` and `web/src` directories are formatted consistently with the rules configured for this project.
Some issues that ESLint reports are just warnings; we recommend that you fix these if you can,
but they will not prevent you from merging your pull request (and they do cause the QA check to fail).
Other ESLint findings are considered errors and are requirements for merging your pull request.

To fix issues reported by ESLint, first review the failures by running `yarn eslint api/src web/src` from the root of this repository, which will output all warnings and errors.
Many ESLint issues can be fixed automatically by adding the `--fix` flag to this command, but you can also resolve them manually if you prefer.

Sometimes, an ESLint finding is not valid for a particular reason -
maybe you need a nonstandard import behavior, or an import is necessary for its side-effects.
In these cases, specific findings can be ignored.
Check the [ESLint documentation](https://eslint.org/docs/latest/use/configure/rules) for the most appropriate way to ignore the finding.

### TFlint

The [TFLint](https://github.com/terraform-linters/tflint) QA check determines whether Terraform files beneath the `terraform/` directory are using best practices and/or contain potential errors.
These checks can often help address problems that can cause a failure during `terraform apply`
(but may not be found during `terraform plan`),
which makes it especially useful for avoiding failed deployments after a PR is merged.

To run TFlint locally, you might need to [install](https://github.com/terraform-linters/tflint?tab=readme-ov-file#installation) it first.
Once installed, navigate to the `terraform/` directory of the repository and run `tflint --init`
to ensure that the plugins configured in the [`.tflint.hcl` file](https://github.com/usdigitalresponse/cpf-reporter/blob/main/terraform/.tflint.hcl) are up-to-date. Then, run the linter checks by running
`tflint --recursive --minimum-failure-severity=error` to view the problems.
Many TFLint issues can be fixed automatically by adding the `--fix` flag to this command, but you can also resolve them manually if you prefer.

Sometimes, a TFLint finding is not valid for a particular reason.
Or, despite being valid, the team has agreed that it may be bypassed after confirming that doing so will not cause an immediate problem.
In these cases, a `tflint-ignore` pragma comment may be used as an annotation in order to avoid a specific rule violation,
or a `rule` block may be added to `terraform/.tflint.hcl` to ignore the linting rule entirely.
Most TFlint errors will include a reference link that provides justification for the rule's importance and ways to resolve.

For example, if TFLint fails with an error like this:

```
Warning: variable "not_used" is declared but not used (terraform_unused_declarations)

  on config.tf line 1:
   1: variable "not_used" {

Reference: https://github.com/terraform-linters/tflint-ruleset-terraform/blob/v0.1.0/docs/rules/terraform_unused_declarations.md
```

the `terraform_unused_declarations` rule can be disabled only for the `not_used` variable by adding a pragma comment above the variable declaration:
```terraform
# tflint-ignore: terraform_unused_declarations
variable "not_used" {
  type        = string
  description = "This variable is never used."
}
```
