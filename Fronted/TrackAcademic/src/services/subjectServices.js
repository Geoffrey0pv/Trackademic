// services/subjectServices.js
import api from '../utils/api';

const handleRequest = async (requestFn) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.detail ||
      error?.message ||
      'Error desconocido en la API de subjects';
    console.error('API Error (Subjects):', message);
    throw new Error(message);
  }
};

// GET /subjects?program_code=...&search=...
export const getSubjects = ({ programCode = null, search = null } = {}) => {
  const params = new URLSearchParams();
  if (programCode) params.append('program_code', programCode);
  if (search) params.append('search', search);

  return handleRequest(() => api.get(`/subjects/?${params.toString()}`));
};

// GET /subjects/all
export const getAllSubjects = () =>
  handleRequest(() => api.get('/subjects/all'));

// GET /subjects/{subject_code}
export const getSubjectByCode = (code) =>
  handleRequest(() => api.get(`/subjects/${code}`));

// GET /subjects/{subject_code}/semesters
export const getSemestersForSubject = (code) =>
  handleRequest(() => api.get(`/subjects/${code}/semesters`));

// POST /subjects/
export const createSubject = (subjectData) =>
  handleRequest(() => api.post('/subjects', subjectData));

// PUT /subjects/{subject_code}
export const updateSubject = (subjectCode, updatedData) =>
  handleRequest(() => api.put(`/subjects/${subjectCode}`, updatedData));

// DELETE /subjects/{subject_code}
export const deleteSubject = (subjectCode) =>
  handleRequest(() => api.delete(`/subjects/${subjectCode}`));
