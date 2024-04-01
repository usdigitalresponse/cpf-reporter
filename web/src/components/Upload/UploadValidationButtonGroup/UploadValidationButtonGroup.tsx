import Button from 'react-bootstrap/Button';

interface UploadValidationButtonGroupProps {
  latestValidation?: { passed: boolean, results: JSON | null };
  handleFileDownload: () => void;
  handleForceInvalidate: () => void;
  handleValidate: () => void;
}

const UploadValidationButtonGroup: React.FC<UploadValidationButtonGroupProps> = ({
  latestValidation,
  handleFileDownload,
  handleForceInvalidate,
  handleValidate,
}) => {

  /*
    If the upload validation is in progress (results are null and passed is false), render "Validation in progress...".
    If the upload has been validated, render "Invalidate" and "Re-validate" buttons
    If the upload has been invalidated, render the "Re-Validate" button
  */
  const renderValidationButtons = () => {
    const { passed, results } = latestValidation;

    if (results === null) {
      return <span className="fst-italic">Validation in progress...</span>;
    }

    if (passed) {
      return (
        <>
          <Button variant="outline-primary" size="sm" onClick={handleForceInvalidate}>
            Invalidate
          </Button>{' '}
          <Button variant="outline-primary" size="sm" onClick={handleValidate}>
            Re-validate
          </Button>
        </>
      );
    } else {
      return (
        <Button variant="outline-primary" size="sm" onClick={handleValidate}>
          Re-validate
        </Button>
      );
    }
  };

  return (
    <li className="list-group-item">
      <div className="float-end">
        <Button variant="primary" size="sm" onClick={handleFileDownload}>
          Download file
        </Button>{' '}
        {renderValidationButtons()}
      </div>
    </li>
  );
};

export default UploadValidationButtonGroup;