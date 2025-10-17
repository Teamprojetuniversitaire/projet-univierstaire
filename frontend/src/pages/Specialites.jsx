import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { specialiteService, departementService } from '../services/referentielService';

const Specialites = () => {
  const [specialites, setSpecialites] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpecialite, setEditingSpecialite] = useState(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchSpecialites = async () => {
    try {
      const response = await specialiteService.getAll();
      setSpecialites(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des spécialités');
    }
  };

  const fetchDepartements = async () => {
    try {
      const response = await departementService.getAll();
      setDepartements(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des départements');
    }
  };

  useEffect(() => {
    fetchSpecialites();
    fetchDepartements();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editingSpecialite) {
        await specialiteService.update(editingSpecialite.id, data);
        toast.success('Spécialité modifiée avec succès');
      } else {
        await specialiteService.create(data);
        toast.success('Spécialité créée avec succès');
      }
      closeModal();
      fetchSpecialites();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleEdit = (specialite) => {
    setEditingSpecialite(specialite);
    setValue('nom', specialite.nom);
    setValue('id_departement', specialite.id_departement?.id || specialite.id_departement);
    setIsModalOpen(true);
  };

  const handleDelete = async (specialite) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette spécialité ?')) {
      try {
        await specialiteService.delete(specialite.id);
        toast.success('Spécialité supprimée avec succès');
        fetchSpecialites();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSpecialite(null);
    reset();
  };

  const columns = [
    {
      accessorKey: 'nom',
      header: 'Nom de la spécialité',
    },
    {
      accessorKey: 'id_departement',
      header: 'Département',
      cell: ({ row }) => row.original.id_departement?.nom || 'N/A',
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
        <h1 className="text-3xl font-bold text-gray-800">Spécialités</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter une spécialité
        </button>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={specialites}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSpecialite ? 'Modifier la spécialité' : 'Nouvelle spécialité'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la spécialité
            </label>
            <input
              type="text"
              {...register('nom', { required: 'Le nom est requis' })}
              className="input-field"
              placeholder="Ex: Génie Logiciel"
            />
            {errors.nom && (
              <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Département
            </label>
            <select
              {...register('id_departement', { required: 'Le département est requis' })}
              className="input-field"
            >
              <option value="">Sélectionner un département</option>
              {departements.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.nom}
                </option>
              ))}
            </select>
            {errors.id_departement && (
              <p className="text-red-500 text-sm mt-1">{errors.id_departement.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={closeModal} className="btn-secondary">
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              {editingSpecialite ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Specialites;
