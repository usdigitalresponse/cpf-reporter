import { useAuth } from "src/auth"
import TreasuryReportCell from "src/components/TreasuryReportCell/TreasuryReportCell"

type TreasuryReportPageProps = {
  organizationId: number
  currentReportingPeriodId: number
}

const TreasuryReportPage = ({ organizationId, currentReportingPeriodId }: TreasuryReportPageProps) => {
  const { currentUser } = useAuth()

  if ( currentUser.agency.organizationId === organizationId) {
    return (
      <TreasuryReportCell
        organizationId={organizationId}
        currentReportingPeriodId={currentReportingPeriodId}
      />
    )
  } else {
    return <ForbiddenPage />
  }
}

export default TreasuryReportPage
