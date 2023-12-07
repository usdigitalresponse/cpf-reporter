import EditAgencyCell from 'src/components/Agency/EditAgencyCell'

type AgencyPageProps = {
  id: number
}

const EditAgencyPage = ({ id }: AgencyPageProps) => {
  return <EditAgencyCell id={id} />
}

export default EditAgencyPage
