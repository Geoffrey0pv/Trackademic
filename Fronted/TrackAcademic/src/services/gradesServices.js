import api from '../utils/api';

const handleRequest = async (requestFn) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.detail ||
      error?.message ||
      "Error desconocido en la API de calificaciones";
    console.error("API Error (Grades):", message);
    throw new Error(message);
  }
};

export const createGrade = (grade) =>
  handleRequest(() => api.post('/grades', grade));

export const getAllGrades = () =>
  handleRequest(() => api.get('/grades'));

export const getGradeById = (id) =>
  handleRequest(() => api.get(`/grades/${id}`));

export const updateGrade = (id, grade) =>
  handleRequest(() => api.put(`/grades/${id}`, grade));

export const deleteGrade = (id) =>
  handleRequest(() => api.delete(`/grades/${id}`));

export const getGradesByUser = (userId) =>
  handleRequest(() => api.get(`/grades/by-user/${userId}`));

export const getNeededGrade = (userId, subjectId) =>
  handleRequest(() => api.get(`/grades/projection/${userId}/${subjectId}`));

export const getSemesterConsolidate = (userId, semester) =>
  handleRequest(() => api.get(`/grades/semester-consolidate/${userId}/${semester}`));

export const getComparativeAnalysis = (userId) =>
  handleRequest(() => api.get(`/grades/comparative/${userId}`));
