import api from '../utils/api';

const handleRequest = async (requestFn) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.detail ||
      error?.message ||
      "Error desconocido en la API";
    console.error("API Error:", message);
    throw new Error(message);
  }
};


export const getEvaluationPlans = () =>
  handleRequest(() => api.get('/evaluation-plans'));


export const getEvaluationPlanById = (id) =>
  handleRequest(() => api.get(`/evaluation-plans/${id}`));


export const createEvaluationPlan = (plan) =>
  handleRequest(() => api.post('/evaluation-plans', plan));


export const updateEvaluationPlan = (id, updatedPlan) =>
  handleRequest(() => api.put(`/evaluation-plans/${id}`, updatedPlan));


export const deleteEvaluationPlan = (id,updatedPlan) =>
  handleRequest(() => api.delete(`/evaluation-plans/${id}`,updatedPlan));

export const searchEvaluationPlans = (semester, subjectId) => {
  const params = {};
  if (semester) params.semester = semester;
  if (subjectId) params.subject_id = subjectId;
  return handleRequest(() =>
    api.get('/evaluation-plans/search', { params })
  );
};