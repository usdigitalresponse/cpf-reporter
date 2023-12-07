import OrganizationCell from 'src/components/Organization/OrganizationCell'

type OrganizationPageProps = {
  id: number
}

const OrganizationPage = ({ id }: OrganizationPageProps) => {
  return <OrganizationCell id={id} />
}

export default OrganizationPage
