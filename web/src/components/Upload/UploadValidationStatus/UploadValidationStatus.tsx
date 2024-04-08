import { timeTag } from 'src/lib/formatters';

const UploadValidationStatus = ({ latestValidation }) => {
  const getValidationIcon = (passed: boolean) => {
    const iconClass = passed ? 'bi bi-check-lg' : 'bi bi-x-circle-fill';
    return <i className={iconClass} />;
  };

  const getValidationStatus = () => {
    if (latestValidation?.results === null) {
      return <span className="text-warning fst-italic">Validation in progress...</span>;
    }

    const { passed, createdAt, initiatedBy } = latestValidation;
    const statusText = passed ? 'Validated' : 'Invalidated';
    const statusClass = passed ? 'text-success' : 'text-danger';

    return (
      <span className={statusClass}>
        {getValidationIcon(passed)} {statusText} on {timeTag(createdAt)} by{' '}
        {initiatedBy?.name}
      </span>
    );
  };

  return (
    <li className='list-group-item'>
      <span className="fw-bold">Validation: </span>
      {getValidationStatus()}
    </li>
  );
};

export default UploadValidationStatus;