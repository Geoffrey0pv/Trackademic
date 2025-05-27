import api from '../../utils/api';

const handleRequest = async (requestFn) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.detail ||
      error?.message ||
      "Error desconocido en la API de estudiantes";
    console.error("API Error (Students):", message);
    throw new Error(message);
  }
};

export const loginStudent = (username, password) =>
  handleRequest(() =>
    api.post('/students/login', { username, password })
  );

export const createStudent = (student) =>
  handleRequest(() =>
    api.post('/students', student)
  );

export const getAllStudents = () =>
  handleRequest(() =>
    api.get('/students')
  );

export const getStudentById = (studentId) =>
  handleRequest(() =>
    api.get(`/students/${studentId}`)
  );

export const updateStudent = (studentId, student) =>
  handleRequest(() =>
    api.put(`/students/${studentId}`, student)
  );

export const deleteStudent = (studentId) =>
  handleRequest(() =>
    api.delete(`/students/${studentId}`)
  );
