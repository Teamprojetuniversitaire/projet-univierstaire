import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { departementService } from '../services/referentielService';

const Departements = () => {
  const [departements, setDepartements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartement, setEditingDepartement] = useState(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchDepartements = async () => {
    try {
      const response = await departementService.getAll();
      setDepartements(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des départements');
    }
  };

  useEffect(() => {
    fetchDepartements();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editingDepartement) {
        await departementService.update(editingDepartement.id, data);
        toast.success('Département modifié avec succès');
      } else {
        await departementService.create(data);
        toast.success('Département créé avec succès');
      }
      closeModal();
      fetchDepartements();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleEdit = (departement) => {
    setEditingDepartement(departement);
    setValue('nom', departement.nom);
    setIsModalOpen(true);
  };

  const handleDelete = async (departement) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) {
      try {
        await departementService.delete(departement.id);
        toast.success('Département supprimé avec succès');
        fetchDepartements();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDepartement(null);
    reset();
  };

  const columns = [
    {
      accessorKey: 'nom',
      header: 'Nom du département',
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
        <h1 className="text-3xl font-bold text-gray-800">Départements</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter un département
        </button>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={departements}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingDepartement ? 'Modifier le département' : 'Nouveau département'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du département
            </label>
            <input
              type="text"
              {...register('nom', { required: 'Le nom est requis' })}
              className="input-field"
              placeholder="Ex: Informatique"
            />
            {errors.nom && (
              <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={closeModal} className="btn-secondary">
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              {editingDepartement ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Departements;
