const { supabase } = require('./db');

// GET all groupes
exports.getAllGroupes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        level:levels(
          *,
          program:programs(
            *,
            department:departments(*)
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const groupes = data.map(group => ({
      id: group.id,
      nom: group.name,
      code: group.code,
      niveau: group.level ? {
        id: group.level.id,
        nom: group.level.name,
        specialite: group.level.program ? {
          id: group.level.program.id,
          nom: group.level.program.name,
          departement: group.level.program.department ? {
            id: group.level.program.department.id,
            nom: group.level.program.department.name
          } : null
        } : null
      } : null,
      createdAt: group.created_at,
      updatedAt: group.updated_at
    }));

    res.json(groupes);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET single groupe
exports.getGroupeById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        level:levels(
          *,
          program:programs(
            *,
            department:departments(*)
          )
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: 'Groupe non trouvé' });
    }

    const groupe = {
      id: data.id,
      nom: data.name,
      code: data.code,
      niveau: data.level ? {
        id: data.level.id,
        nom: data.level.name,
        specialite: data.level.program ? {
          id: data.level.program.id,
          nom: data.level.program.name,
          departement: data.level.program.department ? {
            id: data.level.program.department.id,
            nom: data.level.program.department.name
          } : null
        } : null
      } : null,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.json(groupe);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ message: error.message });
  }
};

// CREATE groupe
exports.createGroupe = async (req, res) => {
  try {
    const { nom, code, niveau_id } = req.body;

    const { data, error } = await supabase
      .from('groups')
      .insert([
        { 
          name: nom,
          code: code,
          level_id: niveau_id
        }
      ])
      .select(`
        *,
        level:levels(
          *,
          program:programs(
            *,
            department:departments(*)
          )
        )
      `)
      .single();

    if (error) throw error;

    const groupe = {
      id: data.id,
      nom: data.name,
      code: data.code,
      niveau: data.level ? {
        id: data.level.id,
        nom: data.level.name,
        specialite: data.level.program ? {
          id: data.level.program.id,
          nom: data.level.program.name,
          departement: data.level.program.department ? {
            id: data.level.program.department.id,
            nom: data.level.program.department.name
          } : null
        } : null
      } : null,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.status(201).json(groupe);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(400).json({ message: error.message });
  }
};

// UPDATE groupe
exports.updateGroupe = async (req, res) => {
  try {
    const { nom, code, niveau_id } = req.body;

    const { data, error } = await supabase
      .from('groups')
      .update({ 
        name: nom,
        code: code,
        level_id: niveau_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select(`
        *,
        level:levels(
          *,
          program:programs(
            *,
            department:departments(*)
          )
        )
      `)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: 'Groupe non trouvé' });
    }

    const groupe = {
      id: data.id,
      nom: data.name,
      code: data.code,
      niveau: data.level ? {
        id: data.level.id,
        nom: data.level.name,
        specialite: data.level.program ? {
          id: data.level.program.id,
          nom: data.level.program.name,
          departement: data.level.program.department ? {
            id: data.level.program.department.id,
            nom: data.level.program.department.name
          } : null
        } : null
      } : null,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.json(groupe);
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(400).json({ message: error.message });
  }
};

// DELETE groupe
exports.deleteGroupe = async (req, res) => {
  try {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Groupe supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ message: error.message });
  }
};
