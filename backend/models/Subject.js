import { supabase } from '../config/supabase.js';

export class Subject {
  static async create(subjectData) {
    const { data, error } = await supabase
      .from('subjects')
      .insert([subjectData])
      .select();
    if (error) throw error;
    return data[0];
  }

  static async createMany(subjectsData) {
    const { data, error } = await supabase
      .from('subjects')
      .insert(subjectsData)
      .select();
    if (error) throw error;
    return data;
  }

  static async findAll() {
    const { data, error } = await supabase
      .from('subjects')
      .select('*, departments(*), levels(*)')
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('subjects')
      .select('*, departments(*), levels(*)')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findByCode(code) {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('code', code)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findByDepartment(departmentId) {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('department_id', departmentId);
    if (error) throw error;
    return data;
  }

  static async findByLevel(levelId) {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('level_id', levelId);
    if (error) throw error;
    return data;
  }
}
