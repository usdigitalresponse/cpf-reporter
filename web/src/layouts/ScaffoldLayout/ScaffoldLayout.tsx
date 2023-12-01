import Container from 'react-bootstrap/Container';

type LayoutProps = {
  children: React.ReactNode
}

const ScaffoldLayout = ({children}: LayoutProps) => {
  return (
    <div>
      <Container fluid>
        <main>{children}</main>
      </Container>
    </div>
  )
}

export default ScaffoldLayout
