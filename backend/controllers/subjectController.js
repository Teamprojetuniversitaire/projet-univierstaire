import fs from 'fs';
import csvParser from 'csv-parser';
import { Parser } from 'json2csv';
import { Subject } from '../models/Subject.js';

export const importSubjects = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const subjects = [];
    const errors = [];
    let lineNumber = 0;

    const stream = fs.createReadStream(req.file.path)
      .pipe(csvParser({ mapHeaders: ({ header }) => header.trim().toLowerCase() }));

    for await (const row of stream) {
      lineNumber++;
      const { name, code, credits, coefficient, department_id, level_id, is_mandatory, description } = row;
      
      if (!name) {
        errors.push({ line: lineNumber, message: 'Nom requis', data: row });
        continue;
      }

      subjects.push({
        name: name.trim(),
        code: code ? code.trim() : null,
        credits: credits ? parseInt(credits) : 3,
        coefficient: coefficient ? parseFloat(coefficient) : 1.0,
        department_id: department_id ? parseInt(department_id) : null,
        level_id: level_id ? parseInt(level_id) : null,
        is_mandatory: is_mandatory === 'true' || is_mandatory === '1',
        description: description ? description.trim() : null
      });
    }

    fs.unlinkSync(req.file.path);

    if (subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucune matière valide trouvée',
        errors
      });
    }

    const inserted = await Subject.createMany(subjects);

    res.status(200).json({
      success: true,
      message: `${inserted.length} matière(s) importée(s) avec succès`,
      data: { imported: inserted.length, errors: errors.length, errorDetails: errors }
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

export const exportSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.findAll();

    if (subjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aucune matière à exporter'
      });
    }

    const dataForExport = subjects.map(subject => ({
      name: subject.name,
      code: subject.code || '',
      credits: subject.credits,
      coefficient: subject.coefficient,
      department_id: subject.department_id || '',
      level_id: subject.level_id || '',
      is_mandatory: subject.is_mandatory ? 'true' : 'false',
      description: subject.description || ''
    }));

    const parser = new Parser({
      fields: ['name', 'code', 'credits', 'coefficient', 'department_id', 'level_id', 'is_mandatory', 'description'],
      delimiter: ',',
      header: true
    });

    const csv = parser.parse(dataForExport);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=subjects_${Date.now()}.csv`);
    res.status(200).send('\uFEFF' + csv);
  } catch (error) {
    next(error);
  }
};

export const downloadTemplate = (req, res) => {
  const template = 'name,code,credits,coefficient,department_id,level_id,is_mandatory,description\nAlgorithmique,ALGO,6,2.0,1,1,true,Cours d\'algorithmique\n';
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=template_subjects.csv');
  res.status(200).send('\uFEFF' + template);
};

export const getAllSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.findAll();
    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });
  } catch (error) {
    next(error);
  }
};

export const getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Matière non trouvée'
      });
    }
    res.status(200).json({
      success: true,
      data: subject
    });
  } catch (error) {
    next(error);
  }
};
