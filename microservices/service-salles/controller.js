const { supabase } = require('./db');

// GET all salles
exports.getAllSalles = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*, room_type:room_types(id, name)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const salles = data.map(room => ({
      id: room.id,
      nom: room.code,
      capacite: room.capacity,
      type: room.room_type ? room.room_type.name : null,
      createdAt: room.created_at,
      updatedAt: room.updated_at
    }));

    res.json(salles);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET single salle
exports.getSalleById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*, room_type:room_types(id, name)')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: 'Salle non trouvée' });
    }

    const salle = {
      id: data.id,
      nom: data.code,
      capacite: data.capacity,
      type: data.room_type ? data.room_type.name : null,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.json(salle);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ message: error.message });
  }
};

// CREATE salle
exports.createSalle = async (req, res) => {
  try {
    const { nom, capacite, type } = req.body;

    // Get room type ID by name
    let roomTypeId = null;
    if (type) {
      const { data: roomType, error: typeError } = await supabase
        .from('room_types')
        .select('id')
        .eq('name', type)
        .single();
      
      if (!typeError && roomType) {
        roomTypeId = roomType.id;
      }
    }

    const { data, error } = await supabase
      .from('rooms')
      .insert([
        { 
          code: nom,
          capacity: capacite,
          room_type_id: roomTypeId
        }
      ])
      .select('*, room_type:room_types(id, name)')
      .single();

    if (error) throw error;

    const salle = {
      id: data.id,
      nom: data.code,
      capacite: data.capacity,
      type: data.room_type ? data.room_type.name : null,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.status(201).json(salle);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(400).json({ message: error.message });
  }
};

// UPDATE salle
exports.updateSalle = async (req, res) => {
  try {
    const { nom, capacite, type } = req.body;

    // Get room type ID by name
    let roomTypeId = null;
    if (type) {
      const { data: roomType, error: typeError } = await supabase
        .from('room_types')
        .select('id')
        .eq('name', type)
        .single();
      
      if (!typeError && roomType) {
        roomTypeId = roomType.id;
      }
    }

    const { data, error } = await supabase
      .from('rooms')
      .update({ 
        code: nom,
        capacity: capacite,
        room_type_id: roomTypeId,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select('*, room_type:room_types(id, name)')
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: 'Salle non trouvée' });
    }

    const salle = {
      id: data.id,
      nom: data.code,
      capacite: data.capacity,
      type: data.room_type ? data.room_type.name : null,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.json(salle);
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(400).json({ message: error.message });
  }
};

// DELETE salle
exports.deleteSalle = async (req, res) => {
  try {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Salle supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: error.message });
  }
};
