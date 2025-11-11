import { supabase } from '../config/supabase.js';

export class Etudiant {
  /**
   * Créer un étudiant
   * Schema: code, nom, prenom, email, telephone, date_naissance, adresse, 
   *         program_id, level_id, group_id, annee_admission, statut
   */
  static async create(etudiantData) {
    const { data, error } = await supabase
      .from('etudiants')
      .insert([etudiantData])
      .select();

    if (error) throw error;
    return data[0];
  }

  /**
   * Créer plusieurs étudiants en batch (pour import CSV)
   */
  static async createMany(etudiantsData) {
    const { data, error } = await supabase
      .from('etudiants')
      .insert(etudiantsData)
      .select();

    if (error) throw error;
    return data;
  }

  /**
   * Récupérer tous les étudiants avec relations
   */
  static async findAll() {
    const { data, error } = await supabase
      .from('etudiants')
      .select(`
        *,
        program:programs(id, name, code),
        level:levels(id, name),
        group:groups(id, name, code)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Trouver un étudiant par code
   */
  static async findByCode(code) {
    const { data, error } = await supabase
      .from('etudiants')
      .select('*')
      .eq('code', code)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Supprimer tous les étudiants (pour les tests)
   */
  static async deleteAll() {
    const { error } = await supabase
      .from('etudiants')
      .delete()
      .neq('id', 0);

    if (error) throw error;
  }
}
