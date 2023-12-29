import { MetaTags } from '@redwoodjs/web'

const ForbiddenPage = () => {
  return (
    <>
      <MetaTags title="Forbidden" description="Forbidden page" />
      <h2>Access to this page is restricted.</h2>
    </>
  )
}

export default ForbiddenPage
