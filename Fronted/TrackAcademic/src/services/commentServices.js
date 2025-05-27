import api from '../../utils/api';

const handleRequest = async (requestFn) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.detail ||
      error?.message ||
      "Error desconocido en la API de comentarios";
    console.error("API Error (Comments):", message);
    throw new Error(message);
  }
};


export const getAllComments = () =>
  handleRequest(() => api.get('/comments'));


export const getCommentById = (id) =>
  handleRequest(() => api.get(`/comments/${id}`));

export const createComment = (comment, planId) =>
  handleRequest(() =>
    api.post(`/comments?plan_id=${planId}`, comment)
  );

export const updateComment = (id, updatedComment) =>
  handleRequest(() =>
    api.put(`/comments/${id}`, updatedComment)
  );


export const deleteComment = (id) =>
  handleRequest(() => api.delete(`/comments/${id}`));


export const getCommentsByPlan = (planId) =>
  handleRequest(() =>
    api.get(`/comments/by-plan/${planId}`)
  );