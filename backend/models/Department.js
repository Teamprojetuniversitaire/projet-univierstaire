import { supabase } from '../config/supabase.js';

export class Department {
  static async create(departmentData) {
    const { data, error } = await supabase
      .from('departments')
      .insert([departmentData])
      .select();
    if (error) throw error;
    return data[0];
  }

  static async createMany(departmentsData) {
    const { data, error } = await supabase
      .from('departments')
      .insert(departmentsData)
      .select();
    if (error) throw error;
    return data;
  }

  static async findAll() {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findByCode(code) {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('code', code)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
}
