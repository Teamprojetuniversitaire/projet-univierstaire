import React, { useState } from 'react';
import CSVSection from './components/CSVSection';
import Notification from './components/Notification';
import { microservices } from './services/api';
import './index.css';

function App() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState({});
  const [activeTab, setActiveTab] = useState('departments');

  // Gestion des notifications
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // Télécharger un fichier blob
  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Handlers génériques pour chaque microservice
  const handleImport = async (microserviceId, file, setProgress) => {
    setLoading((prev) => ({ ...prev, [microserviceId]: true }));
    const microservice = microservices.find(m => m.id === microserviceId);
    
    try {
      const response = await microservice.service.import(file, setProgress);
      addNotification(
        response.data.message || 'Import réussi !',
        'success'
      );
      
      if (response.data.data?.errorDetails?.length > 0) {
        addNotification(
          `${response.data.data.errors} ligne(s) avec erreur(s)`,
          'error'
        );
      }
    } catch (error) {
      console.error(`Erreur import ${microserviceId}:`, error);
      addNotification(
        error.response?.data?.message || 'Erreur lors de l\'import',
        'error'
      );
    } finally {
      setLoading((prev) => ({ ...prev, [microserviceId]: false }));
    }
  };

  const handleExport = async (microserviceId) => {
    setLoading((prev) => ({ ...prev, [microserviceId]: true }));
    const microservice = microservices.find(m => m.id === microserviceId);
    
    try {
      const response = await microservice.service.export();
      downloadBlob(response.data, `${microserviceId}_${Date.now()}.csv`);
      addNotification('Export réussi !', 'success');
    } catch (error) {
      console.error(`Erreur export ${microserviceId}:`, error);
      addNotification(
        error.response?.data?.message || 'Erreur lors de l\'export',
        'error'
      );
    } finally {
      setLoading((prev) => ({ ...prev, [microserviceId]: false }));
    }
  };

  const handleDownloadTemplate = async (microserviceId) => {
    const microservice = microservices.find(m => m.id === microserviceId);
    
    try {
      const response = await microservice.service.downloadTemplate();
      downloadBlob(response.data, `template_${microserviceId}.csv`);
      addNotification('Modèle téléchargé !', 'success');
    } catch (error) {
      console.error(`Erreur téléchargement template ${microserviceId}:`, error);
      addNotification('Erreur lors du téléchargement', 'error');
    }
  };

  const activeMicroservice = microservices.find(m => m.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestion CSV</h1>
                <p className="text-sm text-gray-600">Import & Export - Système Universitaire</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Backend API</div>
              <div className="text-xs text-green-600 font-semibold">● Connecté</div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {microservices.map((ms) => (
                <button
                  key={ms.id}
                  onClick={() => setActiveTab(ms.id)}
                  className={`
                    flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap
                    transition-all duration-200 border-b-2
                    ${activeTab === ms.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-xl">{ms.icon}</span>
                  <span>{ms.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Active Microservice Content */}
          {activeMicroservice && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                  <span className="text-3xl">{activeMicroservice.icon}</span>
                  <span>{activeMicroservice.name}</span>
                </h2>
                <p className="text-gray-600 mt-1">{activeMicroservice.description}</p>
              </div>

              <CSVSection
                title={activeMicroservice.name}
                icon={activeMicroservice.icon}
                onImport={(file, setProgress) => handleImport(activeMicroservice.id, file, setProgress)}
                onExport={() => handleExport(activeMicroservice.id)}
                onDownloadTemplate={() => handleDownloadTemplate(activeMicroservice.id)}
                loading={loading[activeMicroservice.id]}
                csvFormat={{
                  departments: 'code, name, description',
                  'room-types': 'code, name, description, capacity, has_computers',
                  programs: 'code, name, department_id, level',
                  levels: 'code, name, order',
                  subjects: 'code, name, description, credits, hours',
                  groups: 'code, name, program_id, level_id, capacity',
                  rooms: 'code, name, room_type_id, capacity, building, floor'
                }[activeMicroservice.id] || 'Voir le template CSV'
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notif) => (
          <Notification
            key={notif.id}
            message={notif.message}
            type={notif.type}
            onClose={() => removeNotification(notif.id)}
          />
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-500 text-sm">
        <p>© 2025 Microservice Import/Export CSV - Tous droits réservés</p>
        <p className="mt-1">
          <span className="inline-flex items-center space-x-1">
            <span>⚡</span>
            <span>Propulsé par Node.js, React & Supabase</span>
          </span>
        </p>
      </footer>
    </div>
  );
}

export default App;
