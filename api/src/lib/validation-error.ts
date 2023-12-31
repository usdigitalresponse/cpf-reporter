/**
 * severity: "err" | "warn"
 */
class ValidationError extends Error {
  severity: string
  tab: string | null
  row: number | null
  col: number | null

  constructor(
    message,
    { severity = 'err', tab = null, row = null, col = null } = {}
  ) {
    super(message)
    this.severity = severity
    this.tab = tab
    this.row = row
    this.col = col
  }

  toObject() {
    return {
      message: this.message,
      severity: this.severity,
      tab: this.tab,
      row: this.row,
      col: this.col,
    }
  }
}

export { ValidationError }
