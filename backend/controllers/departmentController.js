import fs from 'fs';
import csvParser from 'csv-parser';
import { Parser } from 'json2csv';
import { Department } from '../models/Department.js';

/**
 * @swagger
 * /api/departments/import:
 *   post:
 *     summary: Importer des départements depuis un fichier CSV
 *     tags: [Départements]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 */
export const importDepartments = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const departments = [];
    const errors = [];
    let lineNumber = 0;

    const stream = fs.createReadStream(req.file.path)
      .pipe(csvParser({ mapHeaders: ({ header }) => header.trim().toLowerCase() }));

    for await (const row of stream) {
      lineNumber++;
      const { name, code, description } = row;
      
      if (!name) {
        errors.push({ line: lineNumber, message: 'Nom requis', data: row });
        continue;
      }

      departments.push({
        name: name.trim(),
        code: code ? code.trim() : null,
        description: description ? description.trim() : null
      });
    }

    fs.unlinkSync(req.file.path);

    if (departments.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun département valide trouvé',
        errors
      });
    }

    const inserted = await Department.createMany(departments);

    res.status(200).json({
      success: true,
      message: `${inserted.length} département(s) importé(s) avec succès`,
      data: { imported: inserted.length, errors: errors.length, errorDetails: errors }
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

/**
 * @swagger
 * /api/departments/export:
 *   get:
 *     summary: Exporter les départements en CSV
 *     tags: [Départements]
 */
export const exportDepartments = async (req, res, next) => {
  try {
    const departments = await Department.findAll();

    if (departments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aucun département à exporter'
      });
    }

    const dataForExport = departments.map(dept => ({
      name: dept.name,
      code: dept.code || '',
      description: dept.description || ''
    }));

    const parser = new Parser({
      fields: ['name', 'code', 'description'],
      delimiter: ',',
      header: true
    });

    const csv = parser.parse(dataForExport);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=departments_${Date.now()}.csv`);
    res.status(200).send('\uFEFF' + csv);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/departments/template:
 *   get:
 *     summary: Télécharger un modèle CSV pour les départements
 *     tags: [Départements]
 */
export const downloadTemplate = (req, res) => {
  const template = 'name,code,description\nInformatique,INFO,Département d\'Informatique\n';
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=template_departments.csv');
  res.status(200).send('\uFEFF' + template);
};

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Récupérer tous les départements
 *     tags: [Départements]
 */
export const getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.findAll();
    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/departments/{id}:
 *   get:
 *     summary: Récupérer un département par ID
 *     tags: [Départements]
 */
export const getDepartmentById = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Département non trouvé'
      });
    }
    res.status(200).json({
      success: true,
      data: department
    });
  } catch (error) {
    next(error);
  }
};
