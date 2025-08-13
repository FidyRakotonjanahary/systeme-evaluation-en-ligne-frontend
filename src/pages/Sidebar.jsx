import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const DashboardIcon = ({ isActive }) => (
  <svg 
    stroke="currentColor" 
    className="size-5" 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill={isActive ? "currentColor" : "none"}
    strokeWidth={1.5}
  >
    <path d="M14,10V22H4a2,2,0,0,1-2-2V10Z" />
    <path d="M22,10V20a2,2,0,0,1-2,2H16V10Z" />
    <path d="M22,4V8H2V4A2,2,0,0,1,4,2H20A2,2,0,0,1,22,4Z" />
  </svg>
);

const StudentIcon = ({ isActive }) => (
  <svg
    className="size-5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill={isActive ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
    <path d="M12 6a3 3 0 100 6 3 3 0 000-6z" />
    <path d="M12 14c-3.783 0-7 1.105-7 3v2h14v-2c0-1.895-3.217-3-7-3z" />
  </svg>
);

const ExamIcon = ({ isActive }) => (
  <svg
    className="size-5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill={isActive ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
    <path d="M7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" />
  </svg>
);

const SubjectIcon = ({ isActive }) => (
  <svg
    className="size-5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill={isActive ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
    <path d="M12 6a3 3 0 100 6 3 3 0 000-6z" />
    <path d="M12 14c-3.783 0-7 1.105-7 3v2h14v-2c0-1.895-3.217-3-7-3z" />
    <path d="M17 8v4h-3v3h3v4h2v-4h3v-3h-3v-4z" />
  </svg>
);

const ProfileIcon = ({ isActive }) => (
  <svg 
    className="size-5" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg" 
    fill={isActive ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM6.435 17.12c1.043-2.12 3.045-3.373 5.565-3.373 2.52 0 4.522 1.253 5.565 3.373a8.135 8.135 0 01-5.565 2.13 8.135 8.135 0 01-5.565-2.13zm13.176-1.503c-1.499-2.764-4.165-4.37-7.611-4.37-3.446 0-6.112 1.606-7.611 4.37A8.346 8.346 0 013.5 12c0-4.684 3.816-8.5 8.5-8.5 4.684 0 8.5 3.816 8.5 8.5 0 1.347-.322 2.622-.889 3.617zM12 6.5a3 3 0 100 6 3 3 0 000-6zm0 1.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/>
  </svg>
);

const LogoutIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    className="size-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path d="M17.2929 14.2929C16.9024 14.6834 16.9024 15.3166 17.2929 15.7071C17.6834 16.0976 18.3166 16.0976 18.7071 15.7071L21.6201 12.7941C21.6351 12.7791 21.6497 12.7637 21.6637 12.748C21.87 12.5648 22 12.2976 22 12C22 11.7024 21.87 11.4352 21.6637 11.252C21.6497 11.2363 21.6351 11.2209 21.6201 11.2059L18.7071 8.29289C18.3166 7.90237 17.6834 7.90237 17.2929 8.29289C16.9024 8.68342 16.9024 9.31658 17.2929 9.70711L18.5858 11H13C12.4477 11 12 11.4477 12 12C12 12.5523 12.4477 13 13 13H18.5858L17.2929 14.2929Z" />
    <path d="M5 2C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H14.5C15.8807 22 17 20.8807 17 19.5V16.7326C16.8519 16.647 16.7125 16.5409 16.5858 16.4142C15.9314 15.7598 15.8253 14.7649 16.2674 14H13C11.8954 14 11 13.1046 11 12C11 10.8954 11.8954 10 13 10H16.2674C15.8253 9.23514 15.9314 8.24015 16.5858 7.58579C16.7125 7.4591 16.8519 7.35296 17 7.26738V4.5C17 3.11929 15.8807 2 14.5 2H5Z" />
  </svg>
);

const NavItem = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = to === '/' 
    ? location.pathname === '/' 
    : location.pathname.startsWith(to);
  
  const baseClasses = "flex w-full items-center gap-3 px-4 py-3 font-medium rounded-lg transition-all duration-200 ease-in-out text-sm";
  const stateClasses = isActive
    ? "bg-green-600 text-white shadow-lg shadow-green-200"
    : "text-gray-600 hover:bg-green-50 hover:text-green-600";

  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className={`${baseClasses} ${stateClasses}`}
      >
        {icon}
        {label}
      </button>
    );
  }

  return (
    <Link 
      to={to}
      className={`${baseClasses} ${stateClasses}`}
    >
      {typeof icon === 'function' ? icon(isActive) : icon}
      {label}
    </Link>
  );
};

function Sidebar() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const navigations = [
    {
      href: '/etudiant',
      name: 'Etudiant',
      icon: (isActive) => <StudentIcon isActive={isActive} />
    },
    {
      href: '/examen',
      name: 'Examen',
      icon: (isActive) => <ExamIcon isActive={isActive} />
    },
    {
      href: '/matiere',
      name: 'Matière',
      icon: (isActive) => <SubjectIcon isActive={isActive} />
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-gray-50 to-white p-4 border-r border-gray-200">
      {/* Logo and title */}
      <div className="mb-8 px-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            EvalPro
          </h1>
        </Link>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 space-y-1">
        <div className="mb-2 px-4 text-xs font-semibold text-gray-400 uppercase">
          Menu Principal
        </div>
        <ul className="space-y-1">
          {navigations.map((nav, index) => (
            <li key={index}>
              <NavItem
                to={nav.href}
                icon={nav.icon}
                label={nav.name}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* User section */}
      <div className="pt-4 border-t border-gray-200">
        <div className="mb-2 px-4 text-xs font-semibold text-gray-400 uppercase">
          Paramètres
        </div>
        <ul className="space-y-1">
          <li>
            <NavItem
              to="/profile"
              icon={(isActive) => <ProfileIcon isActive={isActive} />}
              label={user?.name || 'Profile'}
            />
          </li>
          <li>
            <NavItem
              icon={<LogoutIcon />}
              label="Se déconnecter"
              onClick={handleLogout}
            />
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;