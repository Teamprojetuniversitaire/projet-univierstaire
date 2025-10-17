const { supabase } = require('./db');

// GET all specialites
exports.getAllSpecialites = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('programs')
      .select('*, department:departments(id, name, code)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const specialites = data.map(prog => ({
      id: prog.id,
      nom: prog.name,
      code: prog.code,
      id_departement: prog.department ? {
        id: prog.department.id,
        nom: prog.department.name,
        code: prog.department.code
      } : null,
      createdAt: prog.created_at,
      updatedAt: prog.updated_at
    }));

    res.json(specialites);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET single specialite
exports.getSpecialiteById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('programs')
      .select('*, department:departments(id, name, code)')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: 'Spécialité non trouvée' });
    }

    const specialite = {
      id: data.id,
      nom: data.name,
      code: data.code,
      id_departement: data.department ? {
        id: data.department.id,
        nom: data.department.name,
        code: data.department.code
      } : null,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.json(specialite);
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ message: error.message });
  }
};

// CREATE specialite
exports.createSpecialite = async (req, res) => {
  try {
    const { nom, code, id_departement } = req.body;

    const { data, error } = await supabase
      .from('programs')
      .insert([
        { 
          name: nom,
          code: code,
          department_id: id_departement
        }
      ])
      .select('*, department:departments(id, name, code)')
      .single();

    if (error) throw error;

    const specialite = {
      id: data.id,
      nom: data.name,
      code: data.code,
      id_departement: data.department ? {
        id: data.department.id,
        nom: data.department.name,
        code: data.department.code
      } : null,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.status(201).json(specialite);
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(400).json({ message: error.message });
  }
};

// UPDATE specialite
exports.updateSpecialite = async (req, res) => {
  try {
    const { nom, code, id_departement } = req.body;

    const { data, error } = await supabase
      .from('programs')
      .update({ 
        name: nom,
        code: code,
        department_id: id_departement,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select('*, department:departments(id, name, code)')
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: 'Spécialité non trouvée' });
    }

    const specialite = {
      id: data.id,
      nom: data.name,
      code: data.code,
      id_departement: data.department ? {
        id: data.department.id,
        nom: data.department.name,
        code: data.department.code
      } : null,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.json(specialite);
  } catch (error) {
    console.error('Error updating program:', error);
    res.status(400).json({ message: error.message });
  }
};

// DELETE specialite
exports.deleteSpecialite = async (req, res) => {
  try {
    const { error } = await supabase
      .from('programs')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Spécialité supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ message: error.message });
  }
};
