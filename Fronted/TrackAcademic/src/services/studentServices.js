import api from '../utils/api';

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

export const loginStudent = async (username, password) => {
  try {
    const user = await handleRequest(() =>
      api.post('/students/login', { username, password })
    );
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } else {
      console.error("Error en el login:", response);
      return null;
    }
  } catch (error) {
    console.error("Error en la petición:", error);
    return null;
  }
};

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
