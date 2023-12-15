import EditUploadCell from 'src/components/Upload/EditUploadCell'

type UploadPageProps = {
  id: number
}

const EditUploadPage = ({ id }: UploadPageProps) => {
  return <EditUploadCell id={id} />
}

export default EditUploadPage
