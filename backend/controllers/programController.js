import fs from 'fs';
import csvParser from 'csv-parser';
import { Parser } from 'json2csv';
import { Program } from '../models/Program.js';

export const importPrograms = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const programs = [];
    const errors = [];
    let lineNumber = 0;

    const stream = fs.createReadStream(req.file.path)
      .pipe(csvParser({ mapHeaders: ({ header }) => header.trim().toLowerCase() }));

    for await (const row of stream) {
      lineNumber++;
      const { name, code, department_id, duration_years, description } = row;
      
      if (!name || !department_id) {
        errors.push({ line: lineNumber, message: 'Nom et department_id requis', data: row });
        continue;
      }

      programs.push({
        name: name.trim(),
        code: code ? code.trim() : null,
        department_id: parseInt(department_id),
        duration_years: duration_years ? parseInt(duration_years) : 3,
        description: description ? description.trim() : null
      });
    }

    fs.unlinkSync(req.file.path);

    if (programs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun programme valide trouvé',
        errors
      });
    }

    const inserted = await Program.createMany(programs);

    res.status(200).json({
      success: true,
      message: `${inserted.length} programme(s) importé(s) avec succès`,
      data: { imported: inserted.length, errors: errors.length, errorDetails: errors }
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

export const exportPrograms = async (req, res, next) => {
  try {
    const programs = await Program.findAll();

    if (programs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aucun programme à exporter'
      });
    }

    const dataForExport = programs.map(program => ({
      name: program.name,
      code: program.code || '',
      department_id: program.department_id,
      department_name: program.department_name || '',
      duration_years: program.duration_years,
      description: program.description || ''
    }));

    const parser = new Parser({
      fields: ['name', 'code', 'department_id', 'department_name', 'duration_years', 'description'],
      delimiter: ',',
      header: true
    });

    const csv = parser.parse(dataForExport);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=programs_${Date.now()}.csv`);
    res.status(200).send('\uFEFF' + csv);
  } catch (error) {
    next(error);
  }
};

export const downloadTemplate = (req, res) => {
  const template = 'name,code,department_id,duration_years,description\nLicence Informatique,LIC-INFO,1,3,Licence en Informatique\n';
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=template_programs.csv');
  res.status(200).send('\uFEFF' + template);
};

export const getAllPrograms = async (req, res, next) => {
  try {
    const programs = await Program.findAll();
    res.status(200).json({
      success: true,
      count: programs.length,
      data: programs
    });
  } catch (error) {
    next(error);
  }
};

export const getProgramById = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Programme non trouvé'
      });
    }
    res.status(200).json({
      success: true,
      data: program
    });
  } catch (error) {
    next(error);
  }
};
