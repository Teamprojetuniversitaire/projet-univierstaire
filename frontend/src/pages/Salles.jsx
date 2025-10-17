import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { salleService } from '../services/referentielService';

const Salles = () => {
  const [salles, setSalles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSalle, setEditingSalle] = useState(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchSalles = async () => {
    try {
      const response = await salleService.getAll();
      setSalles(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des salles');
    }
  };

  useEffect(() => {
    fetchSalles();
  }, []);

  const onSubmit = async (data) => {
    try {
      // Convert capacite to number
      data.capacite = parseInt(data.capacite);
      
      if (editingSalle) {
        await salleService.update(editingSalle.id, data);
        toast.success('Salle modifiée avec succès');
      } else {
        await salleService.create(data);
        toast.success('Salle créée avec succès');
      }
      closeModal();
      fetchSalles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleEdit = (salle) => {
    setEditingSalle(salle);
    setValue('nom', salle.nom);
    setValue('capacite', salle.capacite);
    setIsModalOpen(true);
  };

  const handleDelete = async (salle) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
      try {
        await salleService.delete(salle.id);
        toast.success('Salle supprimée avec succès');
        fetchSalles();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSalle(null);
    reset();
  };

  const columns = [
    {
      accessorKey: 'nom',
      header: 'Nom de la salle',
    },
    {
      accessorKey: 'capacite',
      header: 'Capacité',
      cell: ({ row }) => `${row.original.capacite} personnes`,
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
        <h1 className="text-3xl font-bold text-gray-800">Salles</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter une salle
        </button>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={salles}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSalle ? 'Modifier la salle' : 'Nouvelle salle'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la salle
            </label>
            <input
              type="text"
              {...register('nom', { required: 'Le nom est requis' })}
              className="input-field"
              placeholder="Ex: Salle A101"
            />
            {errors.nom && (
              <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacité
            </label>
            <input
              type="number"
              min="1"
              {...register('capacite', { 
                required: 'La capacité est requise',
                min: { value: 1, message: 'La capacité doit être au moins 1' }
              })}
              className="input-field"
              placeholder="Ex: 30"
            />
            {errors.capacite && (
              <p className="text-red-500 text-sm mt-1">{errors.capacite.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={closeModal} className="btn-secondary">
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              {editingSalle ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Salles;
