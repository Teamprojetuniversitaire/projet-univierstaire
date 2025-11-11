import React, { useState } from 'react';
import { FiUsers, FiUserCheck } from 'react-icons/fi';
import CSVSection from './components/CSVSection';
import Notification from './components/Notification';
import { etudiantService, enseignantService } from './services/api';
import './index.css';

function App() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState({
    etudiants: false,
    enseignants: false,
  });

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

  // ========== ÉTUDIANTS ==========
  const handleImportEtudiants = async (file, setProgress) => {
    setLoading((prev) => ({ ...prev, etudiants: true }));
    try {
      const response = await etudiantService.import(file, setProgress);
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
      console.error('Erreur import étudiants:', error);
      addNotification(
        error.response?.data?.message || 'Erreur lors de l\'import',
        'error'
      );
    } finally {
      setLoading((prev) => ({ ...prev, etudiants: false }));
    }
  };

  const handleExportEtudiants = async () => {
    setLoading((prev) => ({ ...prev, etudiants: true }));
    try {
      const response = await etudiantService.export();
      downloadBlob(response.data, `etudiants_${Date.now()}.csv`);
      addNotification('Export réussi !', 'success');
    } catch (error) {
      console.error('Erreur export étudiants:', error);
      addNotification(
        error.response?.data?.message || 'Erreur lors de l\'export',
        'error'
      );
    } finally {
      setLoading((prev) => ({ ...prev, etudiants: false }));
    }
  };

  const handleDownloadTemplateEtudiants = async () => {
    try {
      const response = await etudiantService.downloadTemplate();
      downloadBlob(response.data, 'template_etudiants.csv');
      addNotification('Modèle téléchargé !', 'success');
    } catch (error) {
      console.error('Erreur téléchargement template:', error);
      addNotification('Erreur lors du téléchargement', 'error');
    }
  };

  // ========== ENSEIGNANTS ==========
  const handleImportEnseignants = async (file, setProgress) => {
    setLoading((prev) => ({ ...prev, enseignants: true }));
    try {
      const response = await enseignantService.import(file, setProgress);
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
      console.error('Erreur import enseignants:', error);
      addNotification(
        error.response?.data?.message || 'Erreur lors de l\'import',
        'error'
      );
    } finally {
      setLoading((prev) => ({ ...prev, enseignants: false }));
    }
  };

  const handleExportEnseignants = async () => {
    setLoading((prev) => ({ ...prev, enseignants: true }));
    try {
      const response = await enseignantService.export();
      downloadBlob(response.data, `enseignants_${Date.now()}.csv`);
      addNotification('Export réussi !', 'success');
    } catch (error) {
      console.error('Erreur export enseignants:', error);
      addNotification(
        error.response?.data?.message || 'Erreur lors de l\'export',
        'error'
      );
    } finally {
      setLoading((prev) => ({ ...prev, enseignants: false }));
    }
  };

  const handleDownloadTemplateEnseignants = async () => {
    try {
      const response = await enseignantService.downloadTemplate();
      downloadBlob(response.data, 'template_enseignants.csv');
      addNotification('Modèle téléchargé !', 'success');
    } catch (error) {
      console.error('Erreur téléchargement template:', error);
      addNotification('Erreur lors du téléchargement', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-lg">
              <FiUsers className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestion CSV
              </h1>
              <p className="text-gray-600">
                Import & Export - Étudiants et Enseignants
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 max-w-md space-y-2">
        {notifications.map((notif) => (
          <Notification
            key={notif.id}
            message={notif.message}
            type={notif.type}
            onClose={() => removeNotification(notif.id)}
          />
        ))}
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section Étudiants */}
          <CSVSection
            title="Étudiants"
            description="Gérer les données des étudiants"
            icon={FiUsers}
            onImport={handleImportEtudiants}
            onExport={handleExportEtudiants}
            onDownloadTemplate={handleDownloadTemplateEtudiants}
            loading={loading.etudiants}
          />

          {/* Section Enseignants */}
          <CSVSection
            title="Enseignants"
            description="Gérer les données des enseignants"
            icon={FiUserCheck}
            onImport={handleImportEnseignants}
            onExport={handleExportEnseignants}
            onDownloadTemplate={handleDownloadTemplateEnseignants}
            loading={loading.enseignants}
          />
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📋 Format des fichiers CSV
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Étudiants
              </h3>
              <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                <p className="text-blue-600">nom, prenom, email, groupe</p>
                <p className="text-gray-600">Dupont, Jean, jean@mail.com, A</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Enseignants
              </h3>
              <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                <p className="text-blue-600">nom, prenom, email, departement</p>
                <p className="text-gray-600">Martin, Sophie, sophie@mail.com, Info</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2025 Microservice Import/Export CSV - Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
