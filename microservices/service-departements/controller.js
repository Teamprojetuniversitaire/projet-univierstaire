const { supabase } = require('./db');

// GET all departments
exports.getAllDepartements = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const departements = data.map(dept => ({
      id: dept.id,
      nom: dept.name,
      code: dept.code,
      createdAt: dept.created_at,
      updatedAt: dept.updated_at
    }));

    res.json(departements);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET single department
exports.getDepartementById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: 'Département non trouvé' });
    }

    const departement = {
      id: data.id,
      nom: data.name,
      code: data.code,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.json(departement);
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ message: error.message });
  }
};

// CREATE department
exports.createDepartement = async (req, res) => {
  try {
    const { nom, code } = req.body;

    const { data, error } = await supabase
      .from('departments')
      .insert([
        { 
          name: nom,
          code: code
        }
      ])
      .select()
      .single();

    if (error) throw error;

    const departement = {
      id: data.id,
      nom: data.name,
      code: data.code,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.status(201).json(departement);
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(400).json({ message: error.message });
  }
};

// UPDATE department
exports.updateDepartement = async (req, res) => {
  try {
    const { nom, code } = req.body;

    const { data, error } = await supabase
      .from('departments')
      .update({ 
        name: nom,
        code: code,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: 'Département non trouvé' });
    }

    const departement = {
      id: data.id,
      nom: data.name,
      code: data.code,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.json(departement);
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(400).json({ message: error.message });
  }
};

// DELETE department
exports.deleteDepartement = async (req, res) => {
  try {
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Département supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ message: error.message });
  }
};
