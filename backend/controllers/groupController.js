import fs from 'fs';
import csvParser from 'csv-parser';
import { Parser } from 'json2csv';
import { Group } from '../models/Group.js';

export const importGroups = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const groups = [];
    const errors = [];
    let lineNumber = 0;

    const stream = fs.createReadStream(req.file.path)
      .pipe(csvParser({ mapHeaders: ({ header }) => header.trim().toLowerCase() }));

    for await (const row of stream) {
      lineNumber++;
      const { name, code, level_id, capacity, current_students, description } = row;
      
      if (!name || !level_id) {
        errors.push({ line: lineNumber, message: 'Nom et level_id requis', data: row });
        continue;
      }

      groups.push({
        name: name.trim(),
        code: code ? code.trim() : null,
        level_id: parseInt(level_id),
        capacity: capacity ? parseInt(capacity) : 30,
        current_students: current_students ? parseInt(current_students) : 0,
        description: description ? description.trim() : null
      });
    }

    fs.unlinkSync(req.file.path);

    if (groups.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun groupe valide trouvé',
        errors
      });
    }

    const inserted = await Group.createMany(groups);

    res.status(200).json({
      success: true,
      message: `${inserted.length} groupe(s) importé(s) avec succès`,
      data: { imported: inserted.length, errors: errors.length, errorDetails: errors }
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

export const exportGroups = async (req, res, next) => {
  try {
    const groups = await Group.findAll();

    if (groups.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aucun groupe à exporter'
      });
    }

    const dataForExport = groups.map(group => ({
      name: group.name,
      code: group.code || '',
      level_id: group.level_id,
      level_name: group.level_name || '',
      capacity: group.capacity,
      current_students: group.current_students,
      description: group.description || ''
    }));

    const parser = new Parser({
      fields: ['name', 'code', 'level_id', 'level_name', 'capacity', 'current_students', 'description'],
      delimiter: ',',
      header: true
    });

    const csv = parser.parse(dataForExport);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=groups_${Date.now()}.csv`);
    res.status(200).send('\uFEFF' + csv);
  } catch (error) {
    next(error);
  }
};

export const downloadTemplate = (req, res) => {
  const template = 'name,code,level_id,capacity,current_students,description\nGroupe A,GA,1,30,25,Groupe de TD\n';
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=template_groups.csv');
  res.status(200).send('\uFEFF' + template);
};

export const getAllGroups = async (req, res, next) => {
  try {
    const groups = await Group.findAll();
    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups
    });
  } catch (error) {
    next(error);
  }
};

export const getGroupById = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Groupe non trouvé'
      });
    }
    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};
