import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
// add a authGuard() to this page to ensure only logged in users as per the docs.passage.id docs
// https://docs.passage.id/docs/redwoodjs

const DashboardPage = () => {
  return (
    <>
      <MetaTags title="Dashboard" description="Dashboard page" />

      <h1>DashboardPage</h1>
      <p>
        Find me in <code>./web/src/pages/DashboardPage/DashboardPage.tsx</code>
      </p>
      <p>
        My default route is named <code>dashboard</code>, link to me with `
        <Link to={routes.dashboard()}>Dashboard</Link>`
      </p>
    </>
  )
}

export default DashboardPage
