import { useParams } from 'react-router-dom';
import { CaseFormWrapper } from '../components/form/CaseFormWrapper';

export function CaseForm() {
  const { id } = useParams();
  const caseId = id && id !== 'nuevo' ? parseInt(id) : undefined;
  return <CaseFormWrapper caseId={caseId} />;
}
