import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Building2, GraduationCap, BookOpen, Users, DoorOpen } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Tableau de bord', path: '/', icon: Home },
    { name: 'Départements', path: '/departements', icon: Building2 },
    { name: 'Spécialités', path: '/specialites', icon: GraduationCap },
    { name: 'Matières', path: '/matieres', icon: BookOpen },
    { name: 'Groupes', path: '/groupes', icon: Users },
    { name: 'Salles', path: '/salles', icon: DoorOpen },
  ];

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-600">Référentiel</h1>
        <p className="text-sm text-gray-500">Académique</p>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors ${
                isActive ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : ''
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
