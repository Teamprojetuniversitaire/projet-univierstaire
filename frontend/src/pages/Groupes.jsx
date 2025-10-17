import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { groupeService, specialiteService } from '../services/referentielService';

const Groupes = () => {
  const [groupes, setGroupes] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroupe, setEditingGroupe] = useState(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchGroupes = async () => {
    try {
      const response = await groupeService.getAll();
      setGroupes(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des groupes');
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
    fetchGroupes();
    fetchSpecialites();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editingGroupe) {
        await groupeService.update(editingGroupe.id, data);
        toast.success('Groupe modifié avec succès');
      } else {
        await groupeService.create(data);
        toast.success('Groupe créé avec succès');
      }
      closeModal();
      fetchGroupes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleEdit = (groupe) => {
    setEditingGroupe(groupe);
    setValue('nom', groupe.nom);
    setValue('id_specialite', groupe.id_specialite?.id || groupe.id_specialite);
    setIsModalOpen(true);
  };

  const handleDelete = async (groupe) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce groupe ?')) {
      try {
        await groupeService.delete(groupe.id);
        toast.success('Groupe supprimé avec succès');
        fetchGroupes();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGroupe(null);
    reset();
  };

  const columns = [
    {
      accessorKey: 'nom',
      header: 'Nom du groupe',
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
        <h1 className="text-3xl font-bold text-gray-800">Groupes</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter un groupe
        </button>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={groupes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingGroupe ? 'Modifier le groupe' : 'Nouveau groupe'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du groupe
            </label>
            <input
              type="text"
              {...register('nom', { required: 'Le nom est requis' })}
              className="input-field"
              placeholder="Ex: Groupe A"
            />
            {errors.nom && (
              <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>
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
              {editingGroupe ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Groupes;
