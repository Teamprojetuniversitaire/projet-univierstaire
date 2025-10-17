import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Departements from './pages/Departements';
import Specialites from './pages/Specialites';
import Matieres from './pages/Matieres';
import Groupes from './pages/Groupes';
import Salles from './pages/Salles';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/departements" element={<Departements />} />
          <Route path="/specialites" element={<Specialites />} />
          <Route path="/matieres" element={<Matieres />} />
          <Route path="/groupes" element={<Groupes />} />
          <Route path="/salles" element={<Salles />} />
        </Routes>
      </Layout>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;
