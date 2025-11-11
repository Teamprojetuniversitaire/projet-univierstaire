import fs from 'fs';
import csvParser from 'csv-parser';
import { Parser } from 'json2csv';
import { Room } from '../models/Room.js';

export const importRooms = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const rooms = [];
    const errors = [];
    let lineNumber = 0;

    const stream = fs.createReadStream(req.file.path)
      .pipe(csvParser({ mapHeaders: ({ header }) => header.trim().toLowerCase() }));

    for await (const row of stream) {
      lineNumber++;
      const { code, name, capacity, room_type_id, building, floor, has_projector, has_computers, description } = row;
      
      if (!code || !capacity) {
        errors.push({ line: lineNumber, message: 'Code et capacité requis', data: row });
        continue;
      }

      if (isNaN(capacity) || capacity <= 0) {
        errors.push({ line: lineNumber, message: 'Capacité invalide', data: row });
        continue;
      }

      rooms.push({
        code: code.trim(),
        name: name ? name.trim() : null,
        capacity: parseInt(capacity),
        room_type_id: room_type_id ? parseInt(room_type_id) : null,
        building: building ? building.trim() : null,
        floor: floor ? parseInt(floor) : null,
        has_projector: has_projector === 'true' || has_projector === '1',
        has_computers: has_computers === 'true' || has_computers === '1',
        description: description ? description.trim() : null
      });
    }

    fs.unlinkSync(req.file.path);

    if (rooms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucune salle valide trouvée',
        errors
      });
    }

    const inserted = await Room.createMany(rooms);

    res.status(200).json({
      success: true,
      message: `${inserted.length} salle(s) importée(s) avec succès`,
      data: { imported: inserted.length, errors: errors.length, errorDetails: errors }
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

export const exportRooms = async (req, res, next) => {
  try {
    const rooms = await Room.findAll();

    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aucune salle à exporter'
      });
    }

    const dataForExport = rooms.map(room => ({
      code: room.code,
      name: room.name || '',
      capacity: room.capacity,
      room_type_id: room.room_type_id || '',
      room_type_name: room.room_type_name || '',
      building: room.building || '',
      floor: room.floor || '',
      has_projector: room.has_projector ? 'true' : 'false',
      has_computers: room.has_computers ? 'true' : 'false',
      description: room.description || ''
    }));

    const parser = new Parser({
      fields: ['code', 'name', 'capacity', 'room_type_id', 'room_type_name', 'building', 'floor', 'has_projector', 'has_computers', 'description'],
      delimiter: ',',
      header: true
    });

    const csv = parser.parse(dataForExport);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=rooms_${Date.now()}.csv`);
    res.status(200).send('\uFEFF' + csv);
  } catch (error) {
    next(error);
  }
};

export const downloadTemplate = (req, res) => {
  const template = 'code,name,capacity,room_type_id,building,floor,has_projector,has_computers,description\nA101,Salle TP,30,1,Bâtiment A,1,true,true,Salle de travaux pratiques\n';
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=template_rooms.csv');
  res.status(200).send('\uFEFF' + template);
};

export const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.findAll();
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
};

export const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Salle non trouvée'
      });
    }
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};
