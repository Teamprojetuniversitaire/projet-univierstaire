import { supabase } from './config/supabase.js';

async function checkDepartments() {
  console.log('\n📊 Vérification des départements...\n');
  
  const { data: departments, error } = await supabase
    .from('departments')
    .select('id, code, name')
    .order('id');
  
  if (error) {
    console.error('❌ Erreur:', error);
    return;
  }
  
  console.log('✅ Départements existants:');
  departments.forEach(dept => {
    console.log(`   ID: ${dept.id} | Code: ${dept.code.padEnd(6)} | ${dept.name}`);
  });
  
  console.log(`\n📈 Total: ${departments.length} département(s)\n`);
}

checkDepartments();
