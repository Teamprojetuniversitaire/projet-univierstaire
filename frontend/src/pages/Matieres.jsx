import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { matiereService, specialiteService } from '../services/referentielService';

const Matieres = () => {
  const [matieres, setMatieres] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatiere, setEditingMatiere] = useState(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchMatieres = async () => {
    try {
      const response = await matiereService.getAll();
      setMatieres(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des matières');
    }
  };

  const fetchSpecialites = async () => {
    try {
      const response = await specialiteService.getAll();
      setSpecialites(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des spécialités');
    }
  };

  useEffect(() => {
    fetchMatieres();
    fetchSpecialites();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editingMatiere) {
        await matiereService.update(editingMatiere.id, data);
        toast.success('Matière modifiée avec succès');
      } else {
        await matiereService.create(data);
        toast.success('Matière créée avec succès');
      }
      closeModal();
      fetchMatieres();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleEdit = (matiere) => {
    setEditingMatiere(matiere);
    setValue('nom', matiere.nom);
    setValue('id_specialite', matiere.id_specialite?.id || matiere.id_specialite);
    setValue('enseignant', matiere.enseignant);
    setIsModalOpen(true);
  };

  const handleDelete = async (matiere) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
      try {
        await matiereService.delete(matiere.id);
        toast.success('Matière supprimée avec succès');
        fetchMatieres();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMatiere(null);
    reset();
  };

  const columns = [
    {
      accessorKey: 'nom',
      header: 'Nom de la matière',
    },
    {
      accessorKey: 'enseignant',
      header: 'Enseignant',
    },
    {
      accessorKey: 'id_specialite',
      header: 'Spécialité',
      cell: ({ row }) => row.original.id_specialite?.nom || 'N/A',
    },
    {
      accessorKey: 'createdAt',
      header: 'Date de création',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('fr-FR'),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Matières</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter une matière
        </button>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={matieres}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingMatiere ? 'Modifier la matière' : 'Nouvelle matière'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la matière
            </label>
            <input
              type="text"
              {...register('nom', { required: 'Le nom est requis' })}
              className="input-field"
              placeholder="Ex: Programmation Web"
            />
            {errors.nom && (
              <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enseignant
            </label>
            <input
              type="text"
              {...register('enseignant', { required: "L'enseignant est requis" })}
              className="input-field"
              placeholder="Ex: Dr. Dupont"
            />
            {errors.enseignant && (
              <p className="text-red-500 text-sm mt-1">{errors.enseignant.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Spécialité
            </label>
            <select
              {...register('id_specialite', { required: 'La spécialité est requise' })}
              className="input-field"
            >
              <option value="">Sélectionner une spécialité</option>
              {specialites.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.nom}
                </option>
              ))}
            </select>
            {errors.id_specialite && (
              <p className="text-red-500 text-sm mt-1">{errors.id_specialite.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={closeModal} className="btn-secondary">
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              {editingMatiere ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Matieres;
