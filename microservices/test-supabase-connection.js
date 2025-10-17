const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://cgzxtxslrnwsugxdvpxu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnenh0eHNscm53c3VneGR2cHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NDAzNDcsImV4cCI6MjA3NjIxNjM0N30.YuQxXA97QMOuWpNGjkR-_Ks3KFXhVrHoKkzjHti2NeA';

async function testSupabaseConnection() {
    console.log('🔧 Testing Supabase Connection...\n');
    console.log('Supabase URL:', SUPABASE_URL);
    console.log('Anon Key:', SUPABASE_ANON_KEY.substring(0, 20) + '...\n');

    try {
        // Create Supabase client
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase client created successfully\n');

        // Test 1: Check connection by querying tables
        console.log('📊 Testing table access...\n');

        const tables = ['departements', 'specialites', 'matieres', 'groupes', 'salles'];
        
        for (const table of tables) {
            try {
                console.log(`  Testing ${table}...`);
                const { data, error, count } = await supabase
                    .from(table)
                    .select('*', { count: 'exact', head: true });

                if (error) {
                    console.log(`  ❌ ${table}: ${error.message}`);
                } else {
                    console.log(`  ✅ ${table}: Table accessible (${count || 0} rows)`);
                }
            } catch (err) {
                console.log(`  ❌ ${table}: ${err.message}`);
            }
        }

        console.log('\n📝 Fetching sample data from departements...');
        const { data: deptData, error: deptError } = await supabase
            .from('departements')
            .select('*')
            .limit(3);

        if (deptError) {
            console.log('❌ Error fetching departements:', deptError.message);
        } else {
            console.log('✅ Sample departements data:', JSON.stringify(deptData, null, 2));
        }

        console.log('\n✅ Supabase connection test completed successfully!');
        
    } catch (error) {
        console.error('❌ Supabase connection test failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

// Run the test
testSupabaseConnection().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
