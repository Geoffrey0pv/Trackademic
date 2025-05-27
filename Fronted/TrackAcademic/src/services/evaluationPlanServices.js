import api from '../../utils/api';

export const getEvaluationPlans = async () => {
  try {
    const response = await api.get('/evaluation-plans');
    return response.data;
  } catch (error) {
    console.error("Error fetching evaluation plans:", error);
    throw error;
  }
}

export const createEvaluationPlan = async (plan) => {
  try {
    const response = await api.post('/evaluation-plans', plan);
    return response.data;
  } catch (error) {
    console.error("Error creating evaluation plan:", error);
    throw error;
  }
}

export const updateEvaluationPlan = async (id, updatedPlan) => {
    try {
        const response = await api.put(`/evaluation-plans/${id}`, updatedPlan);
        return response.data;
    } catch (error) {
        console.error("Error updating evaluation plan:", error);
        throw error;
    }
}

export const deleteEvaluationPlan = async (id) => {
    try {
        const response = await api.delete(`/evaluation-plans/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting evaluation plan:", error);
        throw error;
    }
}

export const getEvaluationPlanById = async (id) => {
    try {
        const response = await api.get(`/evaluation-plans/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching evaluation plan by ID:", error);
        throw error;
    }
}

export const addCommentToPlan = async (id, comment) => {
    try {
        const response = await api.post(`/evaluation-plans/${id}/comments`, comment);
        return response.data;
    } catch (error) {
        console.error("Error adding comment to evaluation plan:", error);
        throw error;
    }
}

