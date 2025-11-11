import { supabase } from './config/supabase.js';

console.log('\n🧪 TEST COMPLET DES MICROSERVICES\n');
console.log('═'.repeat(60));

const microservices = [
  { name: 'Départements', table: 'departments', endpoint: '/api/departments' },
  { name: 'Types de salles', table: 'room_types', endpoint: '/api/room-types' },
  { name: 'Programmes', table: 'programs', endpoint: '/api/programs' },
  { name: 'Niveaux', table: 'levels', endpoint: '/api/levels' },
  { name: 'Matières', table: 'subjects', endpoint: '/api/subjects' },
  { name: 'Groupes', table: 'groups', endpoint: '/api/groups' },
  { name: 'Salles', table: 'rooms', endpoint: '/api/rooms' }
];

async function testAllMicroservices() {
  console.log('\n📊 VÉRIFICATION DES DONNÉES\n');

  let totalRecords = 0;
  const results = [];

  for (const service of microservices) {
    try {
      const { count, error } = await supabase
        .from(service.table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        results.push({
          service: service.name,
          status: '❌',
          count: 0,
          error: error.message
        });
      } else {
        results.push({
          service: service.name,
          status: '✅',
          count: count || 0,
          endpoint: service.endpoint
        });
        totalRecords += count || 0;
      }
    } catch (error) {
      results.push({
        service: service.name,
        status: '❌',
        count: 0,
        error: error.message
      });
    }
  }

  // Afficher les résultats
  console.log('┌─────────────────────────┬────────┬───────┬─────────────────────────┐');
  console.log('│ Microservice            │ Status │ Count │ Endpoint                │');
  console.log('├─────────────────────────┼────────┼───────┼─────────────────────────┤');

  results.forEach(result => {
    const name = result.service.padEnd(23);
    const count = result.count.toString().padStart(5);
    const endpoint = (result.endpoint || '').padEnd(23);
    console.log(`│ ${name} │ ${result.status}     │ ${count} │ ${endpoint} │`);
  });

  console.log('└─────────────────────────┴────────┴───────┴─────────────────────────┘');

  console.log(`\n📈 Total enregistrements : ${totalRecords}`);

  // Vérifier les erreurs
  const errors = results.filter(r => r.status === '❌');
  if (errors.length > 0) {
    console.log('\n⚠️  ERREURS DÉTECTÉES:\n');
    errors.forEach(error => {
      console.log(`   ❌ ${error.service}: ${error.error}`);
    });
  }

  // Test des endpoints API
  console.log('\n\n🌐 ENDPOINTS API DISPONIBLES\n');
  console.log('═'.repeat(60));
  console.log('\nServeur: http://localhost:5000\n');

  console.log('📚 Documentation Swagger:');
  console.log('   http://localhost:5000/api-docs\n');

  console.log('📋 Endpoints par microservice:\n');

  microservices.forEach(service => {
    console.log(`🔹 ${service.name}`);
    console.log(`   GET    ${service.endpoint}           → Liste complète`);
    console.log(`   GET    ${service.endpoint}/:id       → Détail par ID`);
    console.log(`   POST   ${service.endpoint}/import    → Import CSV`);
    console.log(`   GET    ${service.endpoint}/export    → Export CSV`);
    console.log(`   GET    ${service.endpoint}/template  → Template CSV`);
    console.log('');
  });

  // Exemples CURL
  console.log('\n💻 EXEMPLES DE COMMANDES CURL:\n');
  console.log('# Liste des départements');
  console.log('curl http://localhost:5000/api/departments\n');

  console.log('# Export CSV des salles');
  console.log('curl http://localhost:5000/api/rooms/export -o rooms.csv\n');

  console.log('# Télécharger template groupes');
  console.log('curl http://localhost:5000/api/groups/template -o template_groups.csv\n');

  // Fichiers d'exemple
  console.log('\n📁 FICHIERS CSV D\'EXEMPLE DISPONIBLES:\n');
  const exampleFiles = [
    'departments_exemple.csv',
    'room_types_exemple.csv',
    'programs_exemple.csv',
    'levels_exemple.csv',
    'subjects_exemple.csv',
    'groups_exemple.csv',
    'rooms_exemple.csv'
  ];

  exampleFiles.forEach(file => {
    console.log(`   ✓ exemples/${file}`);
  });

  console.log('\n\n✅ TEST TERMINÉ\n');
  console.log('═'.repeat(60));

  console.log('\n💡 PROCHAINES ÉTAPES:\n');
  console.log('1. Accédez à la documentation: http://localhost:5000/api-docs');
  console.log('2. Testez un import CSV avec les fichiers d\'exemple');
  console.log('3. Exportez les données existantes');
  console.log('4. Consultez MICROSERVICES.md pour la documentation complète\n');
}

testAllMicroservices().catch(error => {
  console.error('\n❌ ERREUR LORS DU TEST:', error.message);
  process.exit(1);
});
