import { supabase } from '../config/supabase.js';

export class Group {
  static async create(groupData) {
    const { data, error } = await supabase
      .from('groups')
      .insert([groupData])
      .select();
    if (error) throw error;
    return data[0];
  }

  static async createMany(groupsData) {
    const { data, error } = await supabase
      .from('groups')
      .insert(groupsData)
      .select();
    if (error) throw error;
    return data;
  }

  static async findAll() {
    const { data, error } = await supabase
      .from('v_groups_full')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('v_groups_full')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findByLevel(levelId) {
    const { data, error } = await supabase
      .from('v_groups_full')
      .select('*')
      .eq('level_id', levelId);
    if (error) throw error;
    return data;
  }
}
