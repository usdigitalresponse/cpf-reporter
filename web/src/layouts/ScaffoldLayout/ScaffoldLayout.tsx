import Container from 'react-bootstrap/Container';

type LayoutProps = {
  title: string
  titleTo: string
  children: React.ReactNode
}

const ScaffoldLayout = ({
  children,
}: LayoutProps) => {
  return (
    <div className="col-12">
      <Container fluid>
        <main>{children}</main>
      </Container>
    </div>
  )
}

export default ScaffoldLayout
