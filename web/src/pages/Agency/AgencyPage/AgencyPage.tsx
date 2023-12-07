import AgencyCell from 'src/components/Agency/AgencyCell'

type AgencyPageProps = {
  id: number
}

const AgencyPage = ({ id }: AgencyPageProps) => {
  return <AgencyCell id={id} />
}

export default AgencyPage
