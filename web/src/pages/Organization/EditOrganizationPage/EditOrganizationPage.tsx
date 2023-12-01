import EditOrganizationCell from 'src/components/Organization/EditOrganizationCell'

type OrganizationPageProps = {
  id: number
}

const EditOrganizationPage = ({ id }: OrganizationPageProps) => {
  return <EditOrganizationCell id={id} />
}

export default EditOrganizationPage
