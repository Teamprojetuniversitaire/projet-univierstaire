import { supabase } from '../config/supabase.js';

export class RoomType {
  static async create(roomTypeData) {
    const { data, error } = await supabase
      .from('room_types')
      .insert([roomTypeData])
      .select();
    if (error) throw error;
    return data[0];
  }

  static async createMany(roomTypesData) {
    const { data, error } = await supabase
      .from('room_types')
      .insert(roomTypesData)
      .select();
    if (error) throw error;
    return data;
  }

  static async findAll() {
    const { data, error } = await supabase
      .from('room_types')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('room_types')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
}
