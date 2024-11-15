import { Link, routes } from '@redwoodjs/router'

import OutputTemplatesCell from 'src/components/OutputTemplate/OutputTemplatesCell'

const OutputTemplatesPage = () => {
  return (
    <div>
      <h2>Output Templates</h2>
      <Link to={routes.newOutputTemplate()} className="btn btn-primary mb-4">
        Create New Output Template
      </Link>
      <OutputTemplatesCell />
    </div>
  )
}

export default OutputTemplatesPage
