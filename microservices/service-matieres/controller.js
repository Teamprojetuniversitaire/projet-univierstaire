const { supabase } = require('./db');

// GET all matieres
exports.getAllMatieres = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*, department:departments(id, name, code)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const matieres = data.map(subject => ({
      id: subject.id,
      nom: subject.name,
      code: subject.code,
      coefficient: subject.credits,
      id_specialite: subject.department ? {
        id: subject.department.id,
        nom: subject.department.name,
        code: subject.department.code
      } : null,
      createdAt: subject.created_at,
      updatedAt: subject.updated_at
    }));

    res.json(matieres);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET single matiere
exports.getMatiereById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*, department:departments(id, name, code)')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: 'Matière non trouvée' });
    }

    const matiere = {
      id: data.id,
      nom: data.name,
      code: data.code,
      coefficient: data.credits,
      id_specialite: data.department ? {
        id: data.department.id,
        nom: data.department.name,
        code: data.department.code
      } : null,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.json(matiere);
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({ message: error.message });
  }
};

// CREATE matiere
exports.createMatiere = async (req, res) => {
  try {
    const { nom, code, coefficient, id_specialite } = req.body;

    const { data, error } = await supabase
      .from('subjects')
      .insert([
        { 
          name: nom,
          code: code,
          credits: coefficient,
          department_id: id_specialite
        }
      ])
      .select('*, department:departments(id, name, code)')
      .single();

    if (error) throw error;

    const matiere = {
      id: data.id,
      nom: data.name,
      code: data.code,
      coefficient: data.credits,
      id_specialite: data.department ? {
        id: data.department.id,
        nom: data.department.name,
        code: data.department.code
      } : null,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.status(201).json(matiere);
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(400).json({ message: error.message });
  }
};

// UPDATE matiere
exports.updateMatiere = async (req, res) => {
  try {
    const { nom, code, coefficient, id_specialite } = req.body;

    const { data, error } = await supabase
      .from('subjects')
      .update({ 
        name: nom,
        code: code,
        credits: coefficient,
        department_id: id_specialite,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select('*, department:departments(id, name, code)')
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: 'Matière non trouvée' });
    }

    const matiere = {
      id: data.id,
      nom: data.name,
      code: data.code,
      coefficient: data.credits,
      id_specialite: data.department ? {
        id: data.department.id,
        nom: data.department.name,
        code: data.department.code
      } : null,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.json(matiere);
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(400).json({ message: error.message });
  }
};

// DELETE matiere
exports.deleteMatiere = async (req, res) => {
  try {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Matière supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ message: error.message });
  }
};
