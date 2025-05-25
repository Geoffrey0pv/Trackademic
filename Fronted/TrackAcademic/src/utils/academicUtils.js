// utils/academicUtils.js

/**
 * Calcula la nota necesaria para aprobar una materia
 * @param {number[]} completed - Notas completadas
 * @param {number} pending - Número de evaluaciones pendientes
 * @param {number} minPassing - Nota mínima para aprobar
 * @param {number[]} weights - Pesos de cada evaluación
 * @returns {string} - Nota necesaria o "Imposible"
 */
export function calculateNeededGrade(completed, pending, minPassing, weights) {
  const completedSum = completed.reduce((sum, grade, index) => sum + (grade * weights[index]), 0);
  const remainingWeights = weights.slice(completed.length).reduce((sum, weight) => sum + weight, 0);
  const needed = (minPassing - completedSum) / remainingWeights;
  return needed > 5 ? "Imposible" : Math.max(0, needed).toFixed(1);
}

/**
 * Calcula el promedio actual de una materia
 * @param {number[]} completed - Notas completadas
 * @param {number[]} weights - Pesos de cada evaluación
 * @returns {string} - Promedio actual
 */
export function getCurrentAverage(completed, weights) {
  if (completed.length === 0) return "0.0";
  const sum = completed.reduce((sum, grade, index) => sum + (grade * weights[index]), 0);
  const usedWeights = weights.slice(0, completed.length).reduce((sum, weight) => sum + weight, 0);
  return (sum / usedWeights).toFixed(1);
}

/**
 * Calcula el progreso de un semestre
 * @param {number} semesterId - ID del semestre
 * @param {Array} subjects - Array de materias
 * @param {Array} grades - Array de calificaciones
 * @returns {Object} - Objeto con progreso del semestre
 */
export function getSemesterProgress(semesterId, subjects, grades) {
  const subj = subjects.filter((s) => s.semester === semesterId);
  const total = subj.length;
  const passed = subj.filter((s) => {
    const g = grades.find((gr) => gr.subjectId === s.id);
    if (!g || g.completed.length === 0) return false;
    const avg = parseFloat(getCurrentAverage(g.completed, g.weight));
    return avg >= g.minPassing;
  }).length;
  return { 
    passed, 
    total, 
    percentage: total > 0 ? Math.round((passed / total) * 100) : 0 
  };
}

/**
 * Calcula el GPA general
 * @param {Array} subjects - Array de materias
 * @param {Array} grades - Array de calificaciones
 * @returns {string} - GPA calculado
 */
export function getOverallGPA(subjects, grades) {
  let totalCredits = 0;
  let weightedSum = 0;
  
  subjects.forEach(subject => {
    const grade = grades.find(g => g.subjectId === subject.id);
    if (grade && grade.completed.length > 0) {
      const avg = parseFloat(getCurrentAverage(grade.completed, grade.weight));
      weightedSum += avg * subject.credits;
      totalCredits += subject.credits;
    }
  });
  
  return totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : "0.00";
}

/**
 * Obtiene datos comparativos por semestre
 * @param {Array} semesters - Array de semestres
 * @param {Array} subjects - Array de materias
 * @param {Array} grades - Array de calificaciones
 * @returns {Array} - Array con datos comparativos
 */
export function getComparativeData(semesters, subjects, grades) {
  return semesters.map(sem => {
    const semSubjects = subjects.filter(s => s.semester === sem.id);
    const averages = semSubjects.map(s => {
      const g = grades.find(gr => gr.subjectId === s.id);
      if (!g || g.completed.length === 0) return 0;
      return parseFloat(getCurrentAverage(g.completed, g.weight));
    });
    const semesterAvg = averages.length > 0 ? averages.reduce((a, b) => a + b, 0) / averages.length : 0;
    return {
      ...sem,
      average: semesterAvg.toFixed(1),
      subjects: semSubjects.length,
      progress: getSemesterProgress(sem.id, subjects, grades)
    };
  });
}

/**
 * Obtiene datos para proyección de notas
 * @param {number} selectedSemester - ID del semestre seleccionado
 * @param {Array} subjects - Array de materias
 * @param {Array} grades - Array de calificaciones
 * @returns {Array} - Array con datos de proyección
 */
export function getProjectionData(selectedSemester, subjects, grades) {
  return subjects
    .filter((s) => s.semester === selectedSemester)
    .map((s) => {
      const g = grades.find((gr) => gr.subjectId === s.id);
      if (!g) return null;
      
      const currentAvg = getCurrentAverage(g.completed, g.weight);
      const needed = calculateNeededGrade(g.completed, g.pending, g.minPassing, g.weight);
      return {
        ...s,
        currentAverage: currentAvg,
        neededGrade: needed,
        pendingEvaluations: g.pending,
        status: parseFloat(currentAvg) >= g.minPassing ? "passing" : "at-risk"
      };
    })
    .filter(Boolean);
}

/**
 * Calcula estadísticas generales del dashboard
 * @param {Array} subjects - Array de materias
 * @param {Array} grades - Array de calificaciones
 * @returns {Object} - Objeto con estadísticas
 */
export function getDashboardStats(subjects, grades) {
  const totalPendingEvaluations = grades.reduce((sum, g) => sum + g.pending, 0);
  
  const atRiskSubjects = subjects.filter(subject => {
    const grade = grades.find(g => g.subjectId === subject.id);
    if (!grade || grade.completed.length === 0) return false;
    const avg = parseFloat(getCurrentAverage(grade.completed, grade.weight));
    return avg < grade.minPassing;
  }).length;

  return {
    totalPendingEvaluations,
    atRiskSubjects,
    totalSubjects: subjects.length,
    totalCredits: subjects.reduce((sum, s) => sum + s.credits, 0)
  };
}