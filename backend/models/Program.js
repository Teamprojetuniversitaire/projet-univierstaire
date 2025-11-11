import { supabase } from '../config/supabase.js';

export class Program {
  static async create(programData) {
    const { data, error } = await supabase
      .from('programs')
      .insert([programData])
      .select();
    if (error) throw error;
    return data[0];
  }

  static async createMany(programsData) {
    const { data, error } = await supabase
      .from('programs')
      .insert(programsData)
      .select();
    if (error) throw error;
    return data;
  }

  static async findAll() {
    const { data, error } = await supabase
      .from('v_programs_full')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('v_programs_full')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findByDepartment(departmentId) {
    const { data, error } = await supabase
      .from('v_programs_full')
      .select('*')
      .eq('department_id', departmentId);
    if (error) throw error;
    return data;
  }
}
