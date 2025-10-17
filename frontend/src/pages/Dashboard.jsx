import React from 'react';
import { Building2, GraduationCap, BookOpen, Users, DoorOpen } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      name: 'Départements',
      icon: Building2,
      color: 'bg-blue-500',
      description: 'Gérer les départements académiques',
    },
    {
      name: 'Spécialités',
      icon: GraduationCap,
      color: 'bg-green-500',
      description: 'Gérer les spécialités par département',
    },
    {
      name: 'Matières',
      icon: BookOpen,
      color: 'bg-purple-500',
      description: 'Gérer les matières et enseignants',
    },
    {
      name: 'Groupes',
      icon: Users,
      color: 'bg-orange-500',
      description: 'Gérer les groupes d\'étudiants',
    },
    {
      name: 'Salles',
      icon: DoorOpen,
      color: 'bg-pink-500',
      description: 'Gérer les salles de cours',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de bord</h1>
      <p className="text-gray-600 mb-8">Bienvenue dans le système de gestion du référentiel académique</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">{stat.name}</h3>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">À propos</h2>
        <p className="text-gray-600 mb-2">
          Ce système vous permet de gérer efficacement le référentiel académique de votre établissement.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Créer, modifier et supprimer des départements</li>
          <li>Gérer les spécialités associées aux départements</li>
          <li>Administrer les matières et affecter les enseignants</li>
          <li>Organiser les groupes d'étudiants</li>
          <li>Gérer les salles de cours et leur capacité</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
