import Button from 'react-bootstrap/Button'

import { toast, Toaster, ToastBar } from '@redwoodjs/web/toast'

import NewTreasuryGeneration from 'src/components/TreasuryGeneration/NewTreasuryGeneration/NewTreasuryGeneration'
/*
Form Field 1 - Accepts a long text containing payload from the user.
Button 1 - Kick-off file generation
Button 2 - Download Project 1A file
Button 3 - Download Project 1B file
Button 4 - Download Project 1C file
Button 5 - Download Subrecipient file
*/

const TreasuryReportGenerationPage = () => {
  return (
    <div>
      <Toaster
        containerStyle={{ top: 200, bottom: 200, left: 200, right: 200 }}
        toastOptions={{ duration: Infinity, style: { maxWidth: '1000px' } }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== 'loading' && (
                  <button onClick={() => toast.dismiss(t.id)}>X</button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
      <h2>Treasury File Generation Tool</h2>
      <NewTreasuryGeneration />

      <div className="rw-button-group">
        <Button className="rw-button">Download Project 1A file</Button>
        <Button className="rw-button">Download Project 1B file</Button>
        <Button className="rw-button">Download Project 1C file</Button>
        <Button className="rw-button">Download Subrecipient file</Button>
      </div>
    </div>
  )
}

export default TreasuryReportGenerationPage
