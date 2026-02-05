import { NavLink } from 'react-router-dom';

export default function NavBar() {
  const navItems = [
    { name: '홈', path: '/' },
    { name: '팀 소개', path: '/team' },
    { name: '날씨', path: '/weather' }
  ];

  return (
    <nav className="flex items-center space-x-1">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`
          }
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
}
