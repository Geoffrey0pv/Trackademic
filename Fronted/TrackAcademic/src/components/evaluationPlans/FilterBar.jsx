const FilterBar = ({ search, course, setSearch, setCourse, courses }) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
    <input
      className="border p-2 rounded w-full md:w-2/3"
      placeholder="Buscar..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <select
      className="border p-2 rounded w-full md:w-1/3"
      value={course}
      onChange={(e) => setCourse(e.target.value)}
    >
      <option value="">Todos los cursos</option>
      {courses.map((c, i) => (
        <option key={i} value={c}>{c}</option>
      ))}
    </select>
  </div>
);

export default FilterBar;
