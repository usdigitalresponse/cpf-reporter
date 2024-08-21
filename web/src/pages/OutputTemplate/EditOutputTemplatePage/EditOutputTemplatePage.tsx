import EditOutputTemplateCell from 'src/components/OutputTemplate/EditOutputTemplateCell'

type OutputTemplatePageProps = {
  id: number
}

const EditOutputTemplatePage = ({ id }: OutputTemplatePageProps) => {
  return <EditOutputTemplateCell id={id} />
}

export default EditOutputTemplatePage
