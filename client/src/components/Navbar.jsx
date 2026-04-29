import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition ${
    isActive ? 'bg-clinic-800 text-white' : 'text-slate-700 hover:bg-clinic-50'
  }`;

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-clinic-800">Медцентр</span>
          <span className="hidden text-sm text-slate-500 sm:inline">учёт приёмов и лечения</span>
        </div>
        <nav className="flex flex-wrap gap-1">
          <NavLink to="/" end className={linkClass}>
            Пациенты
          </NavLink>
          <NavLink to="/doctors" className={linkClass}>
            Врачи
          </NavLink>
          <NavLink to="/appointments" className={linkClass}>
            Приёмы
          </NavLink>
          <NavLink to="/treatments" className={linkClass}>
            Лечение
          </NavLink>
          <NavLink to="/analytics" className={linkClass}>
            Аналитика
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
