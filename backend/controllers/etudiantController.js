import fs from 'fs';
import csvParser from 'csv-parser';
import { Parser } from 'json2csv';
import { Etudiant } from '../models/Etudiant.js';

/**
 * Import des étudiants depuis un fichier CSV
 * Format CSV: code,nom,prenom,email,telephone,date_naissance,adresse,program_id,level_id,group_id,annee_admission,statut
 */
export const importEtudiants = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const etudiants = [];
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
        date_naissance = null,
        adresse = null,
        program_id = null,
        level_id = null,
        group_id = null,
        annee_admission = null,
        statut = 'actif'
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

      // Validation statut
      if (statut && !['actif', 'inactif', 'diplome', 'suspendu'].includes(statut)) {
        errors.push({
          line: lineNumber,
          message: 'Statut invalide (actif, inactif, diplome, suspendu)',
          data: row
        });
        continue;
      }

      // Préparer l'objet étudiant
      const etudiant = {
        code: code.trim(),
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.trim().toLowerCase(),
        statut: statut ? statut.trim() : 'actif'
      };

      // Ajouter les champs optionnels s'ils existent
      if (telephone && telephone.trim()) etudiant.telephone = telephone.trim();
      if (date_naissance && date_naissance.trim()) etudiant.date_naissance = date_naissance.trim();
      if (adresse && adresse.trim()) etudiant.adresse = adresse.trim();
      if (program_id && program_id.trim()) etudiant.program_id = parseInt(program_id);
      if (level_id && level_id.trim()) etudiant.level_id = parseInt(level_id);
      if (group_id && group_id.trim()) etudiant.group_id = parseInt(group_id);
      if (annee_admission && annee_admission.trim()) etudiant.annee_admission = parseInt(annee_admission);

      etudiants.push(etudiant);
    }

    // Supprimer le fichier temporaire
    fs.unlinkSync(req.file.path);

    if (etudiants.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun étudiant valide trouvé dans le fichier CSV',
        errors
      });
    }

    // Insérer en base de données
    const insertedEtudiants = await Etudiant.createMany(etudiants);

    res.status(200).json({
      success: true,
      message: `${insertedEtudiants.length} étudiant(s) importé(s) avec succès`,
      data: {
        imported: insertedEtudiants.length,
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
 * Export des étudiants en CSV
 */
export const exportEtudiants = async (req, res, next) => {
  try {
    const etudiants = await Etudiant.findAll();

    if (etudiants.length === 0) {
      // Retourner un CSV avec uniquement les en-têtes si aucune donnée
      const emptyCSV = 'code,nom,prenom,email,telephone,date_naissance,adresse,program_id,program_name,level_id,level_name,group_id,group_name,annee_admission,statut\n';
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=etudiants_${Date.now()}.csv`);
      return res.status(200).send('\uFEFF' + emptyCSV);
    }

    // Préparer les données pour l'export
    const dataForExport = etudiants.map(etudiant => ({
      code: etudiant.code,
      nom: etudiant.nom,
      prenom: etudiant.prenom,
      email: etudiant.email,
      telephone: etudiant.telephone || '',
      date_naissance: etudiant.date_naissance || '',
      adresse: etudiant.adresse || '',
      program_id: etudiant.program_id || '',
      program_name: etudiant.program?.name || '',
      level_id: etudiant.level_id || '',
      level_name: etudiant.level?.name || '',
      group_id: etudiant.group_id || '',
      group_name: etudiant.group?.name || '',
      annee_admission: etudiant.annee_admission || '',
      statut: etudiant.statut || 'actif'
    }));

    // Convertir en CSV
    const parser = new Parser({
      fields: [
        'code', 'nom', 'prenom', 'email', 'telephone', 
        'date_naissance', 'adresse', 'program_id', 'program_name',
        'level_id', 'level_name', 'group_id', 'group_name',
        'annee_admission', 'statut'
      ],
      delimiter: ',',
      header: true
    });

    const csv = parser.parse(dataForExport);

    // Envoyer le fichier
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=etudiants_${Date.now()}.csv`);
    res.status(200).send('\uFEFF' + csv); // UTF-8 BOM pour Excel
  } catch (error) {
    next(error);
  }
};

/**
 * Télécharger un template CSV
 */
export const downloadTemplate = (req, res) => {
  const template = `code,nom,prenom,email,telephone,date_naissance,adresse,program_id,level_id,group_id,annee_admission,statut
ETU001,Dupont,Jean,jean.dupont@example.com,+33612345678,2000-05-15,123 Rue Example Paris,1,1,1,2023,actif
ETU002,Martin,Sophie,sophie.martin@example.com,+33698765432,2001-08-22,456 Avenue Test Lyon,2,1,2,2023,actif`;
  
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=template_etudiants.csv');
  res.status(200).send('\uFEFF' + template);
};

/**
 * Récupérer tous les étudiants
 */
export const getAllEtudiants = async (req, res, next) => {
  try {
    const etudiants = await Etudiant.findAll();
    res.status(200).json({
      success: true,
      count: etudiants.length,
      data: etudiants
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer tous les étudiants (pour les tests)
 */
export const deleteAllEtudiants = async (req, res, next) => {
  try {
    await Etudiant.deleteAll();
    res.status(200).json({
      success: true,
      message: 'Tous les étudiants ont été supprimés'
    });
  } catch (error) {
    next(error);
  }
};
