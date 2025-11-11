import { supabase } from '../config/supabase.js';

export class Level {
  static async create(levelData) {
    const { data, error } = await supabase
      .from('levels')
      .insert([levelData])
      .select();
    if (error) throw error;
    return data[0];
  }

  static async createMany(levelsData) {
    const { data, error } = await supabase
      .from('levels')
      .insert(levelsData)
      .select();
    if (error) throw error;
    return data;
  }

  static async findAll() {
    const { data, error } = await supabase
      .from('levels')
      .select('*, programs(*)')
      .order('year', { ascending: true });
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('levels')
      .select('*, programs(*)')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findByProgram(programId) {
    const { data, error } = await supabase
      .from('levels')
      .select('*')
      .eq('program_id', programId);
    if (error) throw error;
    return data;
  }
}
