import { supabase } from './config/supabase.js';

console.log('\n🔍 VÉRIFICATION DES TABLES ÉTUDIANTS ET ENSEIGNANTS\n');
console.log('═'.repeat(60));

async function checkTables() {
  try {
    // Test table etudiants
    console.log('\n📋 Test table "etudiants"...');
    const { data: etudiantsData, error: etudiantsError } = await supabase
      .from('etudiants')
      .select('*', { count: 'exact', head: true });

    if (etudiantsError) {
      console.log('❌ Table "etudiants" n\'existe pas');
      console.log('   Erreur:', etudiantsError.message);
    } else {
      console.log('✅ Table "etudiants" existe');
      const { count } = await supabase
        .from('etudiants')
        .select('*', { count: 'exact', head: true });
      console.log(`   📊 ${count || 0} enregistrement(s)`);
    }

    // Test table enseignants
    console.log('\n📋 Test table "enseignants"...');
    const { data: enseignantsData, error: enseignantsError } = await supabase
      .from('enseignants')
      .select('*', { count: 'exact', head: true });

    if (enseignantsError) {
      console.log('❌ Table "enseignants" n\'existe pas');
      console.log('   Erreur:', enseignantsError.message);
    } else {
      console.log('✅ Table "enseignants" existe');
      const { count } = await supabase
        .from('enseignants')
        .select('*', { count: 'exact', head: true });
      console.log(`   📊 ${count || 0} enregistrement(s)`);
    }

    console.log('\n' + '═'.repeat(60));
    console.log('\n📝 RÉSULTAT:\n');

    if (etudiantsError || enseignantsError) {
      console.log('⚠️  LES TABLES N\'EXISTENT PAS ENCORE\n');
      console.log('📋 ACTIONS REQUISES:\n');
      console.log('1. Ouvrez https://supabase.com');
      console.log('2. Allez dans "SQL Editor"');
      console.log('3. Créez une nouvelle requête');
      console.log('4. Copiez-collez le contenu de:');
      console.log('   backend/database/add_etudiants_enseignants.sql');
      console.log('5. Cliquez "Run" pour exécuter');
      console.log('6. Relancez ce test: node check-etudiants-tables.js');
      console.log('7. Redémarrez le backend: npm run dev');
      console.log('\n📖 Guide complet: CORRECTION_URGENTE.md\n');
    } else {
      console.log('✅ TOUTES LES TABLES EXISTENT !\n');
      console.log('Vous pouvez maintenant:');
      console.log('1. Redémarrer le backend (npm run dev)');
      console.log('2. Rafraîchir le navigateur (Ctrl+Shift+R)');
      console.log('3. Tester l\'import/export d\'étudiants et enseignants\n');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }

  process.exit(0);
}

checkTables();
