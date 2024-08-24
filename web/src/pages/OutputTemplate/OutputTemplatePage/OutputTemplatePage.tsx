import OutputTemplateCell from 'src/components/OutputTemplate/OutputTemplateCell'

type OutputTemplatePageProps = {
  id: number
}

const OutputTemplatePage = ({ id }: OutputTemplatePageProps) => {
  return <OutputTemplateCell id={id} />
}

export default OutputTemplatePage
