import EvaluationPlanItem from './EvaluationPlanItem';

const EvaluationPlanList = ({ plans, onEdit, onDelete }) => (
  <div className="grid gap-4">
    {plans.map(plan => (
      <EvaluationPlanItem key={plan.id} plan={plan} onEdit={onEdit} onDelete={onDelete} />
    ))}
  </div>
);

export default EvaluationPlanList;

