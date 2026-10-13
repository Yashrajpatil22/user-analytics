import { NavLink } from "react-router-dom";

function Header() {
  const getLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-150 ${
      isActive ? "text-blue-700" : "text-slate-600 hover:text-slate-900"
    }`;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
          User Analytics
        </h1>

        <nav aria-label="Main navigation" className="flex items-center gap-6">
          <NavLink to="/sessions" className={getLinkClass}>
            Sessions
          </NavLink>

          <NavLink to="/heatmap" className={getLinkClass}>
            Heatmap
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
