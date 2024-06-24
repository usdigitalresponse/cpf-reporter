import Table from 'react-bootstrap/Table'

export enum Severity {
  Error = 'ERR',
  Warning = 'WARN',
  Info = 'INFO',
}

interface Props {
  errors: {
    severity: Severity
    message: string
    tab?: string
    row?: string
    col?: string
  }[]
}

const UploadValidationResultsTable = ({ errors }: Props) => {
  return (
    <>
      <div className="row">
        <h3 className="col text-danger">Validation Results</h3>
      </div>

      <div className="row">
        <div className="col">
          <Table
            striped
            bordered
            responsive="sm"
            className=" col-sm-12 col-md-6"
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Level</th>
                <th>Message</th>
                <th>Tab</th>
                <th>Row</th>
                <th>Col</th>
              </tr>
            </thead>
            <tbody>
              {errors.map((error, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td
                    className={
                      error.severity === Severity.Error
                        ? 'table-danger'
                        : 'table-warning'
                    }
                  >
                    {error.severity === Severity.Error ? 'Error' : 'Warning'}
                  </td>
                  <td>{error.message}</td>
                  <td>{error.tab}</td>
                  <td>{error.row}</td>
                  <td>{error.col}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  )
}

export default UploadValidationResultsTable
export { Severity }
