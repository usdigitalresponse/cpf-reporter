import UploadCell from 'src/components/Upload/UploadCell'

type UploadPageProps = {
  id: number
}

const UploadPage = ({ id }: UploadPageProps) => {
  return <UploadCell id={id} />
}

export default UploadPage
