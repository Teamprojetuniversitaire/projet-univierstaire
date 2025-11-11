import React, { useState } from 'react';
import { FiUpload, FiDownload, FiFile, FiX } from 'react-icons/fi';
import ProgressBar from './ProgressBar';

const CSVSection = ({
  title,
  description,
  onImport,
  onExport,
  onDownloadTemplate,
  loading,
  icon,
  csvFormat,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Lire le fichier pour aperçu
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const lines = text.split('\n').slice(0, 6); // Première ligne (header) + 5 lignes de données
        setPreview(lines);
        setShowPreview(true);
      };
      reader.readAsText(file);
    }
  };

  const handleImport = async () => {
    if (selectedFile) {
      await onImport(selectedFile, setProgress);
      setSelectedFile(null);
      setPreview(null);
      setShowPreview(false);
      setProgress(0);
    }
  };

  const handleCancelFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setShowPreview(false);
    setProgress(0);
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        {icon && (
          typeof icon === 'string' 
            ? <span className="text-3xl">{icon}</span>
            : React.createElement(icon, { className: "text-3xl text-blue-600" })
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-600 text-sm">{description || csvFormat}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Import Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FiUpload /> Import CSV
          </h3>
          
          {!selectedFile ? (
            <div>
              <label className="block">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="input-file"
                  disabled={loading}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Formats acceptés : CSV (max 5MB)
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiFile className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
                <button
                  onClick={handleCancelFile}
                  className="text-red-500 hover:text-red-700"
                  disabled={loading}
                >
                  <FiX />
                </button>
              </div>

              {showPreview && preview && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Aperçu (5 premières lignes)
                  </h4>
                  <div className="bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                    <pre className="text-xs font-mono text-gray-600">
                      {preview.join('\n')}
                    </pre>
                  </div>
                </div>
              )}

              {loading && progress > 0 && (
                <ProgressBar progress={progress} label="Import en cours..." />
              )}

              <button
                onClick={handleImport}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Import en cours...' : 'Importer le fichier'}
              </button>
            </div>
          )}
        </div>

        {/* Export Section */}
        <div className="flex gap-3">
          <button
            onClick={onExport}
            disabled={loading}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <FiDownload />
            Exporter CSV
          </button>
          <button
            onClick={onDownloadTemplate}
            disabled={loading}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <FiFile />
            Télécharger modèle
          </button>
        </div>
      </div>
    </div>
  );
};

export default CSVSection;
