import { supabase } from '../config/supabase.js';

export class Enseignant {
  /**
   * Créer un enseignant
   * Schema: code, nom, prenom, email, telephone, specialite, grade, 
   *         department_id, date_embauche, statut, bureau
   */
  static async create(enseignantData) {
    const { data, error } = await supabase
      .from('enseignants')
      .insert([enseignantData])
      .select();

    if (error) throw error;
    return data[0];
  }

  /**
   * Créer plusieurs enseignants en batch (pour import CSV)
   */
  static async createMany(enseignantsData) {
    const { data, error } = await supabase
      .from('enseignants')
      .insert(enseignantsData)
      .select();

    if (error) throw error;
    return data;
  }

  /**
   * Récupérer tous les enseignants avec relations
   */
  static async findAll() {
    const { data, error } = await supabase
      .from('enseignants')
      .select(`
        *,
        department:departments(id, name, code)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Trouver un enseignant par code
   */
  static async findByCode(code) {
    const { data, error } = await supabase
      .from('enseignants')
      .select('*')
      .eq('code', code)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Supprimer tous les enseignants (pour les tests)
   */
  static async deleteAll() {
    const { error } = await supabase
      .from('enseignants')
      .delete()
      .neq('id', 0);

    if (error) throw error;
  }
}
