import Container from 'react-bootstrap/Container'

type LayoutProps = {
  title: string
  titleTo: string
  children: React.ReactNode
}

const ScaffoldLayout = ({ children }: LayoutProps) => {
  return (
    <Container fluid>
      <main>{children}</main>
    </Container>
  )
}

export default ScaffoldLayout
