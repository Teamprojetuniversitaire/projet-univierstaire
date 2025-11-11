import fs from 'fs';
import csvParser from 'csv-parser';
import { Parser } from 'json2csv';
import { RoomType } from '../models/RoomType.js';

export const importRoomTypes = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const roomTypes = [];
    const errors = [];
    let lineNumber = 0;

    const stream = fs.createReadStream(req.file.path)
      .pipe(csvParser({ mapHeaders: ({ header }) => header.trim().toLowerCase() }));

    for await (const row of stream) {
      lineNumber++;
      const { name, description } = row;
      
      if (!name) {
        errors.push({ line: lineNumber, message: 'Nom requis', data: row });
        continue;
      }

      roomTypes.push({
        name: name.trim(),
        description: description ? description.trim() : null
      });
    }

    fs.unlinkSync(req.file.path);

    if (roomTypes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun type de salle valide trouvé',
        errors
      });
    }

    const inserted = await RoomType.createMany(roomTypes);

    res.status(200).json({
      success: true,
      message: `${inserted.length} type(s) de salle importé(s) avec succès`,
      data: { imported: inserted.length, errors: errors.length, errorDetails: errors }
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

export const exportRoomTypes = async (req, res, next) => {
  try {
    const roomTypes = await RoomType.findAll();

    if (roomTypes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aucun type de salle à exporter'
      });
    }

    const dataForExport = roomTypes.map(rt => ({
      name: rt.name,
      description: rt.description || ''
    }));

    const parser = new Parser({
      fields: ['name', 'description'],
      delimiter: ',',
      header: true
    });

    const csv = parser.parse(dataForExport);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=room_types_${Date.now()}.csv`);
    res.status(200).send('\uFEFF' + csv);
  } catch (error) {
    next(error);
  }
};

export const downloadTemplate = (req, res) => {
  const template = 'name,description\nAmphithéâtre,Grande salle pour cours magistraux\n';
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=template_room_types.csv');
  res.status(200).send('\uFEFF' + template);
};

export const getAllRoomTypes = async (req, res, next) => {
  try {
    const roomTypes = await RoomType.findAll();
    res.status(200).json({
      success: true,
      count: roomTypes.length,
      data: roomTypes
    });
  } catch (error) {
    next(error);
  }
};

export const getRoomTypeById = async (req, res, next) => {
  try {
    const roomType = await RoomType.findById(req.params.id);
    if (!roomType) {
      return res.status(404).json({
        success: false,
        message: 'Type de salle non trouvé'
      });
    }
    res.status(200).json({
      success: true,
      data: roomType
    });
  } catch (error) {
    next(error);
  }
};
