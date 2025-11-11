import { supabase } from '../config/supabase.js';

export class Room {
  static async create(roomData) {
    const { data, error } = await supabase
      .from('rooms')
      .insert([roomData])
      .select();
    if (error) throw error;
    return data[0];
  }

  static async createMany(roomsData) {
    const { data, error } = await supabase
      .from('rooms')
      .insert(roomsData)
      .select();
    if (error) throw error;
    return data;
  }

  static async findAll() {
    const { data, error } = await supabase
      .from('v_rooms_full')
      .select('*')
      .order('code', { ascending: true });
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('v_rooms_full')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findByCode(code) {
    const { data, error } = await supabase
      .from('v_rooms_full')
      .select('*')
      .eq('code', code)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
}
