import fs from 'fs';
import csvParser from 'csv-parser';
import { Parser } from 'json2csv';
import { Level } from '../models/Level.js';

export const importLevels = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const levels = [];
    const errors = [];
    let lineNumber = 0;

    const stream = fs.createReadStream(req.file.path)
      .pipe(csvParser({ mapHeaders: ({ header }) => header.trim().toLowerCase() }));

    for await (const row of stream) {
      lineNumber++;
      const { name, program_id, year, semester } = row;
      
      if (!name || !program_id || !year) {
        errors.push({ line: lineNumber, message: 'Nom, program_id et year requis', data: row });
        continue;
      }

      levels.push({
        name: name.trim(),
        program_id: parseInt(program_id),
        year: parseInt(year),
        semester: semester ? parseInt(semester) : null
      });
    }

    fs.unlinkSync(req.file.path);

    if (levels.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun niveau valide trouvé',
        errors
      });
    }

    const inserted = await Level.createMany(levels);

    res.status(200).json({
      success: true,
      message: `${inserted.length} niveau(x) importé(s) avec succès`,
      data: { imported: inserted.length, errors: errors.length, errorDetails: errors }
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

export const exportLevels = async (req, res, next) => {
  try {
    const levels = await Level.findAll();

    if (levels.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aucun niveau à exporter'
      });
    }

    const dataForExport = levels.map(level => ({
      name: level.name,
      program_id: level.program_id,
      year: level.year,
      semester: level.semester || ''
    }));

    const parser = new Parser({
      fields: ['name', 'program_id', 'year', 'semester'],
      delimiter: ',',
      header: true
    });

    const csv = parser.parse(dataForExport);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=levels_${Date.now()}.csv`);
    res.status(200).send('\uFEFF' + csv);
  } catch (error) {
    next(error);
  }
};

export const downloadTemplate = (req, res) => {
  const template = 'name,program_id,year,semester\nL1 Informatique,1,1,1\n';
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=template_levels.csv');
  res.status(200).send('\uFEFF' + template);
};

export const getAllLevels = async (req, res, next) => {
  try {
    const levels = await Level.findAll();
    res.status(200).json({
      success: true,
      count: levels.length,
      data: levels
    });
  } catch (error) {
    next(error);
  }
};

export const getLevelById = async (req, res, next) => {
  try {
    const level = await Level.findById(req.params.id);
    if (!level) {
      return res.status(404).json({
        success: false,
        message: 'Niveau non trouvé'
      });
    }
    res.status(200).json({
      success: true,
      data: level
    });
  } catch (error) {
    next(error);
  }
};
