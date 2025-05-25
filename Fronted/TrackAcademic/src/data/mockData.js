// Datos mock para el dashboard académico

export const semesters = [
  { id: 1, name: "Semestre 1", year: "2024", status: "completed" },
  { id: 2, name: "Semestre 2", year: "2024", status: "current" },
  { id: 3, name: "Semestre 3", year: "2025", status: "upcoming" },
];

export const subjects = [
  { id: 1, name: "Matemáticas Avanzadas", semester: 1, credits: 4, color: "bg-blue-500" },
  { id: 2, name: "Física Cuántica", semester: 1, credits: 3, color: "bg-green-500" },
  { id: 3, name: "Química Orgánica", semester: 2, credits: 4, color: "bg-purple-500" },
  { id: 4, name: "Historia Contemporánea", semester: 2, credits: 2, color: "bg-orange-500" },
  { id: 5, name: "Programación Web", semester: 2, credits: 3, color: "bg-indigo-500" },
];

export const grades = [
  { subjectId: 1, completed: [4.2, 3.8, 4.5], pending: 1, minPassing: 3.0, weight: [0.2, 0.3, 0.3, 0.2] },
  { subjectId: 2, completed: [2.8, 3.2, 3.5], pending: 1, minPassing: 3.0, weight: [0.25, 0.25, 0.25, 0.25] },
  { subjectId: 3, completed: [4.5, 4.0], pending: 2, minPassing: 3.0, weight: [0.3, 0.3, 0.2, 0.2] },
  { subjectId: 4, completed: [3.0, 3.7, 2.9], pending: 1, minPassing: 3.0, weight: [0.2, 0.3, 0.3, 0.2] },
  { subjectId: 5, completed: [4.8], pending: 3, minPassing: 3.0, weight: [0.25, 0.25, 0.25, 0.25] },
];