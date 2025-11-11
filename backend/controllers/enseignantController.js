import fs from 'fs';
import csvParser from 'csv-parser';
import { Parser } from 'json2csv';
import { Enseignant } from '../models/Enseignant.js';

/**
 * Import des enseignants depuis un fichier CSV
 * Format CSV: code,nom,prenom,email,telephone,specialite,grade,department_id,date_embauche,statut,bureau
 */
export const importEnseignants = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const enseignants = [];
    const errors = [];
    let lineNumber = 0;

    // Lire et parser le CSV
    const stream = fs.createReadStream(req.file.path)
      .pipe(csvParser({
        mapHeaders: ({ header }) => header.trim().toLowerCase()
      }));

    for await (const row of stream) {
      lineNumber++;
      
      // Extraction et validation des champs
      const { 
        code, 
        nom, 
        prenom, 
        email, 
        telephone = null,
        specialite = null,
        grade = null,
        department_id = null,
        date_embauche = null,
        statut = 'actif',
        bureau = null
      } = row;
      
      // Champs requis
      if (!code || !nom || !prenom || !email) {
        errors.push({
          line: lineNumber,
          message: 'Champs manquants (code, nom, prenom, email requis)',
          data: row
        });
        continue;
      }

      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push({
          line: lineNumber,
          message: 'Email invalide',
          data: row
        });
        continue;
      }

      // Validation grade
      const gradesValides = ['Professeur', 'Maitre de conferences', 'Assistant', 'Charge de cours', 'Vacataire'];
      if (grade && !gradesValides.includes(grade)) {
        errors.push({
          line: lineNumber,
          message: `Grade invalide (${gradesValides.join(', ')})`,
          data: row
        });
        continue;
      }

      // Validation statut
      if (statut && !['actif', 'inactif', 'retraite', 'conge'].includes(statut)) {
        errors.push({
          line: lineNumber,
          message: 'Statut invalide (actif, inactif, retraite, conge)',
          data: row
        });
        continue;
      }

      // Préparer l'objet enseignant
      const enseignant = {
        code: code.trim(),
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.trim().toLowerCase(),
        statut: statut ? statut.trim() : 'actif'
      };

      // Ajouter les champs optionnels s'ils existent
      if (telephone && telephone.trim()) enseignant.telephone = telephone.trim();
      if (specialite && specialite.trim()) enseignant.specialite = specialite.trim();
      if (grade && grade.trim()) enseignant.grade = grade.trim();
      if (department_id && department_id.trim()) enseignant.department_id = parseInt(department_id);
      if (date_embauche && date_embauche.trim()) enseignant.date_embauche = date_embauche.trim();
      if (bureau && bureau.trim()) enseignant.bureau = bureau.trim();

      enseignants.push(enseignant);
    }

    // Supprimer le fichier temporaire
    fs.unlinkSync(req.file.path);

    if (enseignants.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun enseignant valide trouvé dans le fichier CSV',
        errors
      });
    }

    // Insérer en base de données
    const insertedEnseignants = await Enseignant.createMany(enseignants);

    res.status(200).json({
      success: true,
      message: `${insertedEnseignants.length} enseignant(s) importé(s) avec succès`,
      data: {
        imported: insertedEnseignants.length,
        errors: errors.length,
        errorDetails: errors
      }
    });
  } catch (error) {
    // Nettoyer le fichier en cas d'erreur
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

/**
 * Export des enseignants en CSV
 */
export const exportEnseignants = async (req, res, next) => {
  try {
    const enseignants = await Enseignant.findAll();

    if (enseignants.length === 0) {
      // Retourner un CSV avec uniquement les en-têtes si aucune donnée
      const emptyCSV = 'code,nom,prenom,email,telephone,specialite,grade,department_id,department_name,date_embauche,statut,bureau\n';
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=enseignants_${Date.now()}.csv`);
      return res.status(200).send('\uFEFF' + emptyCSV);
    }

    // Préparer les données pour l'export
    const dataForExport = enseignants.map(enseignant => ({
      code: enseignant.code,
      nom: enseignant.nom,
      prenom: enseignant.prenom,
      email: enseignant.email,
      telephone: enseignant.telephone || '',
      specialite: enseignant.specialite || '',
      grade: enseignant.grade || '',
      department_id: enseignant.department_id || '',
      department_name: enseignant.department?.name || '',
      date_embauche: enseignant.date_embauche || '',
      statut: enseignant.statut || 'actif',
      bureau: enseignant.bureau || ''
    }));

    // Convertir en CSV
    const parser = new Parser({
      fields: [
        'code', 'nom', 'prenom', 'email', 'telephone', 
        'specialite', 'grade', 'department_id', 'department_name',
        'date_embauche', 'statut', 'bureau'
      ],
      delimiter: ',',
      header: true
    });

    const csv = parser.parse(dataForExport);

    // Envoyer le fichier
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=enseignants_${Date.now()}.csv`);
    res.status(200).send('\uFEFF' + csv); // UTF-8 BOM pour Excel
  } catch (error) {
    next(error);
  }
};

/**
 * Télécharger un template CSV
 */
export const downloadTemplate = (req, res) => {
  const template = `code,nom,prenom,email,telephone,specialite,grade,department_id,date_embauche,statut,bureau
ENS001,Durand,Marie,marie.durand@example.com,+33612345678,Informatique,Professeur,1,2015-09-01,actif,B201
ENS002,Bernard,Pierre,pierre.bernard@example.com,+33698765432,Mathématiques,Maitre de conferences,2,2018-09-01,actif,C105`;
  
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=template_enseignants.csv');
  res.status(200).send('\uFEFF' + template);
};

/**
 * Récupérer tous les enseignants
 */
export const getAllEnseignants = async (req, res, next) => {
  try {
    const enseignants = await Enseignant.findAll();
    res.status(200).json({
      success: true,
      count: enseignants.length,
      data: enseignants
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer tous les enseignants (pour les tests)
 */
export const deleteAllEnseignants = async (req, res, next) => {
  try {
    await Enseignant.deleteAll();
    res.status(200).json({
      success: true,
      message: 'Tous les enseignants ont été supprimés'
    });
  } catch (error) {
    next(error);
  }
};
