import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type LayoutProps = {
  title: string
  titleTo: string
  // buttonLabel: string
  // buttonTo: string
  children: React.ReactNode
}

const ScaffoldLayout = ({
  title,
  titleTo,
  children,
}: LayoutProps) => {
  return (
    <div className="col-12">
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      <header className="rw-header">
        <h1 className="rw-heading rw-heading-primary">
          <Link to={routes[titleTo]()} className="rw-link">
            {title}
          </Link>
        </h1>
      </header>
      <Container fluid>
        <main>{children}</main>
      </Container>
    </div>
  )
}

export default ScaffoldLayout
