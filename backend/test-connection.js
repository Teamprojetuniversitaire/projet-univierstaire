import { supabase } from './config/supabase.js';

console.log('🔍 Test de connexion Supabase...\n');

async function testSupabaseConnection() {
  try {
    // Test 1: Vérifier la connexion de base
    console.log('✅ Test 1: Configuration Supabase');
    console.log('   URL:', process.env.SUPABASE_URL);
    console.log('   Key:', process.env.SUPABASE_KEY ? '✓ Définie' : '✗ Manquante');
    console.log('');

    // Test 2: Vérifier que les tables existent
    console.log('✅ Test 2: Vérification des tables...');
    
    const tables = [
      'departments',
      'room_types',
      'programs',
      'levels',
      'subjects',
      'groups',
      'rooms'
    ];

    const tableStatus = {};
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`   ❌ Table "${table}":`, error.message);
        tableStatus[table] = false;
      } else {
        console.log(`   ✓ Table "${table}" accessible`);
        tableStatus[table] = true;
      }
    }
    console.log('');

    const allTablesExist = Object.values(tableStatus).every(status => status);

    if (!allTablesExist) {
      console.log('   💡 Certaines tables sont manquantes.');
      console.log('   � Exécutez le script backend/database/schema.sql dans Supabase');
      console.log('');
    }

    // Test 3: Compter les enregistrements
    if (allTablesExist) {
      console.log('✅ Test 3: Comptage des enregistrements...');
      
      for (const table of tables) {
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        console.log(`   📊 ${table}: ${count || 0} enregistrement(s)`);
      }
      console.log('');
    }

    // Test 4: Test d'insertion et suppression sur departments
    if (tableStatus.departments) {
      console.log('✅ Test 4: Test d\'écriture (departments)...');
      
      const testDepartment = {
        name: `Test Département ${Date.now()}`,
        code: `TEST${Date.now()}`,
        description: 'Test de connexion'
      };

      const { data: inserted, error: insertError } = await supabase
        .from('departments')
        .insert([testDepartment])
        .select();

      if (insertError) {
        console.log('   ❌ Erreur d\'insertion:', insertError.message);
      } else {
        console.log('   ✓ Insertion réussie');
        
        // Supprimer l'enregistrement de test
        const { error: deleteError } = await supabase
          .from('departments')
          .delete()
          .eq('id', inserted[0].id);

        if (deleteError) {
          console.log('   ⚠️  Erreur de suppression:', deleteError.message);
        } else {
          console.log('   ✓ Suppression réussie');
        }
      }
      console.log('');
    }

    // Test 5: Vérifier les vues
    console.log('✅ Test 5: Vérification des vues...');
    
    const views = ['v_programs_full', 'v_groups_full', 'v_rooms_full'];
    
    for (const view of views) {
      const { data, error } = await supabase
        .from(view)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`   ⚠️  Vue "${view}":`, error.message);
      } else {
        console.log(`   ✓ Vue "${view}" accessible`);
      }
    }
    console.log('');

    console.log('═══════════════════════════════════════════');
    console.log('🎉 Tests de connexion terminés !');
    console.log('═══════════════════════════════════════════');
    console.log('');
    console.log('� Résumé des tables:');
    for (const [table, status] of Object.entries(tableStatus)) {
      console.log(`   ${status ? '✓' : '✗'} ${table}`);
    }
    console.log('');
    console.log('💡 Prochaines étapes :');
    if (!allTablesExist) {
      console.log('   1. Exécutez backend/database/schema.sql dans Supabase SQL Editor');
      console.log('   2. Relancez ce test: node test-connection.js');
    } else {
      console.log('   1. Démarrez le serveur : npm run dev');
      console.log('   2. Accédez à la doc API : http://localhost:5000/api-docs');
      console.log('   3. Testez l\'import/export CSV');
    }
    console.log('');

  } catch (error) {
    console.error('');
    console.error('═══════════════════════════════════════════');
    console.error('❌ ERREUR DE CONNEXION');
    console.error('═══════════════════════════════════════════');
    console.error('');
    console.error('Message:', error.message);
    console.error('');
    console.error('💡 Solutions possibles :');
    console.error('   1. Vérifiez que le fichier .env existe (copiez .env.example vers .env)');
    console.error('   2. Vérifiez vos credentials Supabase dans .env');
    console.error('   3. Vérifiez que votre projet Supabase est actif');
    console.error('   4. Vérifiez votre connexion internet');
    console.error('');
    process.exit(1);
  }
}

testSupabaseConnection();
