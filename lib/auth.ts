import { supabase } from './supabase';

export async function signInCustomer(name: string, phone: string) {
  try {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length < 10) {
      return { error: 'Введите корректный номер телефона' };
    }

    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', cleanPhone)
      .single();

    if (existingCustomer) {
      const { error } = await supabase
        .from('customers')
        .update({ name })
        .eq('id', existingCustomer.id);
      
      if (error) throw error;
      return { success: true, customer: { ...existingCustomer, name } };
    } else {
      const { data, error } = await supabase
        .from('customers')
        .insert([{ name, phone: cleanPhone }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, customer: data };
    }
  } catch (error: any) {
    console.error('Ошибка входа:', error);
    return { error: error.message || 'Ошибка при входе' };
  }
}