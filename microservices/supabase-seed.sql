-- ============================================
-- DONNÉES DE TEST POUR SUPABASE
-- Système de Gestion du Référentiel Universitaire
-- ============================================

-- IMPORTANT: Exécutez d'abord supabase-schema.sql avant ce fichier !

-- ============================================
-- 1. DÉPARTEMENTS
-- ============================================
INSERT INTO departments (name, code, description) VALUES
    ('Informatique', 'INFO', 'Département d''informatique et systèmes d''information'),
    ('Mathématiques', 'MATH', 'Département de mathématiques et statistiques'),
    ('Physique', 'PHYS', 'Département de physique et sciences appliquées'),
    ('Chimie', 'CHIM', 'Département de chimie'),
    ('Biologie', 'BIO', 'Département de biologie et sciences naturelles'),
    ('Génie Civil', 'GC', 'Département de génie civil et construction'),
    ('Électronique', 'ELEC', 'Département d''électronique et télécommunications'),
    ('Gestion', 'GEST', 'Département de gestion et économie')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 2. TYPES DE SALLES
-- ============================================
INSERT INTO room_types (name, description) VALUES
    ('Amphithéâtre', 'Grande salle pour cours magistraux'),
    ('Salle TD', 'Salle de travaux dirigés'),
    ('Salle TP', 'Salle de travaux pratiques'),
    ('Laboratoire Informatique', 'Salle équipée d''ordinateurs'),
    ('Laboratoire Physique', 'Laboratoire de physique expérimentale'),
    ('Laboratoire Chimie', 'Laboratoire de chimie'),
    ('Salle de Conférence', 'Salle pour séminaires et conférences'),
    ('Bibliothèque', 'Espace de lecture et recherche')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 3. PROGRAMMES (Spécialités)
-- ============================================
-- Programmes Informatique
INSERT INTO programs (name, code, department_id, duration_years, description) 
SELECT 'Licence Informatique Générale', 'LIG', d.id, 3, 'Formation générale en informatique'
FROM departments d WHERE d.code = 'INFO'
ON CONFLICT (name, department_id) DO NOTHING;

INSERT INTO programs (name, code, department_id, duration_years, description) 
SELECT 'Licence Systèmes d''Information', 'LSI', d.id, 3, 'Spécialisation en systèmes d''information'
FROM departments d WHERE d.code = 'INFO'
ON CONFLICT (name, department_id) DO NOTHING;

INSERT INTO programs (name, code, department_id, duration_years, description) 
SELECT 'Master Génie Logiciel', 'MGL', d.id, 2, 'Master en génie logiciel'
FROM departments d WHERE d.code = 'INFO'
ON CONFLICT (name, department_id) DO NOTHING;

INSERT INTO programs (name, code, department_id, duration_years, description) 
SELECT 'Master Intelligence Artificielle', 'MIA', d.id, 2, 'Master en IA et Machine Learning'
FROM departments d WHERE d.code = 'INFO'
ON CONFLICT (name, department_id) DO NOTHING;

-- Programmes Mathématiques
INSERT INTO programs (name, code, department_id, duration_years, description) 
SELECT 'Licence Mathématiques', 'LMATH', d.id, 3, 'Formation en mathématiques fondamentales'
FROM departments d WHERE d.code = 'MATH'
ON CONFLICT (name, department_id) DO NOTHING;

INSERT INTO programs (name, code, department_id, duration_years, description) 
SELECT 'Master Mathématiques Appliquées', 'MMA', d.id, 2, 'Master en mathématiques appliquées'
FROM departments d WHERE d.code = 'MATH'
ON CONFLICT (name, department_id) DO NOTHING;

-- Programmes Physique
INSERT INTO programs (name, code, department_id, duration_years, description) 
SELECT 'Licence Physique', 'LPHYS', d.id, 3, 'Formation en physique fondamentale'
FROM departments d WHERE d.code = 'PHYS'
ON CONFLICT (name, department_id) DO NOTHING;

-- Programmes Gestion
INSERT INTO programs (name, code, department_id, duration_years, description) 
SELECT 'Licence Gestion', 'LGEST', d.id, 3, 'Formation en gestion d''entreprise'
FROM departments d WHERE d.code = 'GEST'
ON CONFLICT (name, department_id) DO NOTHING;

-- ============================================
-- 4. NIVEAUX
-- ============================================
-- Niveaux Licence Informatique Générale (L1, L2, L3)
INSERT INTO levels (name, program_id, year, semester)
SELECT 'L1 Semestre 1', p.id, 1, 1
FROM programs p WHERE p.code = 'LIG'
ON CONFLICT (program_id, year, semester) DO NOTHING;

INSERT INTO levels (name, program_id, year, semester)
SELECT 'L1 Semestre 2', p.id, 1, 2
FROM programs p WHERE p.code = 'LIG'
ON CONFLICT (program_id, year, semester) DO NOTHING;

INSERT INTO levels (name, program_id, year, semester)
SELECT 'L2 Semestre 1', p.id, 2, 1
FROM programs p WHERE p.code = 'LIG'
ON CONFLICT (program_id, year, semester) DO NOTHING;

INSERT INTO levels (name, program_id, year, semester)
SELECT 'L2 Semestre 2', p.id, 2, 2
FROM programs p WHERE p.code = 'LIG'
ON CONFLICT (program_id, year, semester) DO NOTHING;

INSERT INTO levels (name, program_id, year, semester)
SELECT 'L3 Semestre 1', p.id, 3, 1
FROM programs p WHERE p.code = 'LIG'
ON CONFLICT (program_id, year, semester) DO NOTHING;

INSERT INTO levels (name, program_id, year, semester)
SELECT 'L3 Semestre 2', p.id, 3, 2
FROM programs p WHERE p.code = 'LIG'
ON CONFLICT (program_id, year, semester) DO NOTHING;

-- Niveaux Master Génie Logiciel (M1, M2)
INSERT INTO levels (name, program_id, year, semester)
SELECT 'M1 Semestre 1', p.id, 1, 1
FROM programs p WHERE p.code = 'MGL'
ON CONFLICT (program_id, year, semester) DO NOTHING;

INSERT INTO levels (name, program_id, year, semester)
SELECT 'M1 Semestre 2', p.id, 1, 2
FROM programs p WHERE p.code = 'MGL'
ON CONFLICT (program_id, year, semester) DO NOTHING;

INSERT INTO levels (name, program_id, year, semester)
SELECT 'M2 Semestre 1', p.id, 2, 1
FROM programs p WHERE p.code = 'MGL'
ON CONFLICT (program_id, year, semester) DO NOTHING;

INSERT INTO levels (name, program_id, year, semester)
SELECT 'M2 Semestre 2', p.id, 2, 2
FROM programs p WHERE p.code = 'MGL'
ON CONFLICT (program_id, year, semester) DO NOTHING;

-- ============================================
-- 5. MATIÈRES
-- ============================================
-- Matières L1 Informatique
INSERT INTO subjects (name, code, credits, coefficient, department_id, level_id, is_mandatory)
SELECT 
    'Algorithmique et Structures de Données', 
    'ALGO1', 
    6, 
    2.0, 
    d.id,
    l.id,
    true
FROM departments d, levels l, programs p
WHERE d.code = 'INFO' 
  AND l.program_id = p.id 
  AND p.code = 'LIG' 
  AND l.year = 1 
  AND l.semester = 1;

INSERT INTO subjects (name, code, credits, coefficient, department_id, level_id, is_mandatory)
SELECT 
    'Introduction à la Programmation', 
    'PROG1', 
    6, 
    2.0, 
    d.id,
    l.id,
    true
FROM departments d, levels l, programs p
WHERE d.code = 'INFO' 
  AND l.program_id = p.id 
  AND p.code = 'LIG' 
  AND l.year = 1 
  AND l.semester = 1;

INSERT INTO subjects (name, code, credits, coefficient, department_id, level_id, is_mandatory)
SELECT 
    'Mathématiques pour l''Informatique', 
    'MATH1', 
    5, 
    1.5, 
    d.id,
    l.id,
    true
FROM departments d, levels l, programs p
WHERE d.code = 'MATH' 
  AND l.program_id = p.id 
  AND p.code = 'LIG' 
  AND l.year = 1 
  AND l.semester = 1;

INSERT INTO subjects (name, code, credits, coefficient, department_id, level_id, is_mandatory)
SELECT 
    'Architecture des Ordinateurs', 
    'ARCHI1', 
    5, 
    1.5, 
    d.id,
    l.id,
    true
FROM departments d, levels l, programs p
WHERE d.code = 'INFO' 
  AND l.program_id = p.id 
  AND p.code = 'LIG' 
  AND l.year = 1 
  AND l.semester = 1;

INSERT INTO subjects (name, code, credits, coefficient, department_id, level_id, is_mandatory)
SELECT 
    'Anglais Technique', 
    'ANG1', 
    3, 
    1.0, 
    d.id,
    l.id,
    true
FROM departments d, levels l, programs p
WHERE d.code = 'INFO' 
  AND l.program_id = p.id 
  AND p.code = 'LIG' 
  AND l.year = 1 
  AND l.semester = 1;

-- Matières L1 Semestre 2
INSERT INTO subjects (name, code, credits, coefficient, department_id, level_id, is_mandatory)
SELECT 
    'Programmation Orientée Objet', 
    'POO1', 
    6, 
    2.0, 
    d.id,
    l.id,
    true
FROM departments d, levels l, programs p
WHERE d.code = 'INFO' 
  AND l.program_id = p.id 
  AND p.code = 'LIG' 
  AND l.year = 1 
  AND l.semester = 2;

INSERT INTO subjects (name, code, credits, coefficient, department_id, level_id, is_mandatory)
SELECT 
    'Bases de Données', 
    'BDD1', 
    6, 
    2.0, 
    d.id,
    l.id,
    true
FROM departments d, levels l, programs p
WHERE d.code = 'INFO' 
  AND l.program_id = p.id 
  AND p.code = 'LIG' 
  AND l.year = 1 
  AND l.semester = 2;

INSERT INTO subjects (name, code, credits, coefficient, department_id, level_id, is_mandatory)
SELECT 
    'Systèmes d''Exploitation', 
    'SYS1', 
    5, 
    1.5, 
    d.id,
    l.id,
    true
FROM departments d, levels l, programs p
WHERE d.code = 'INFO' 
  AND l.program_id = p.id 
  AND p.code = 'LIG' 
  AND l.year = 1 
  AND l.semester = 2;

-- Matières Master Génie Logiciel
INSERT INTO subjects (name, code, credits, coefficient, department_id, level_id, is_mandatory)
SELECT 
    'Génie Logiciel Avancé', 
    'GLAV', 
    6, 
    2.0, 
    d.id,
    l.id,
    true
FROM departments d, levels l, programs p
WHERE d.code = 'INFO' 
  AND l.program_id = p.id 
  AND p.code = 'MGL' 
  AND l.year = 1 
  AND l.semester = 1;

INSERT INTO subjects (name, code, credits, coefficient, department_id, level_id, is_mandatory)
SELECT 
    'Architecture Logicielle', 
    'ARCHLOG', 
    6, 
    2.0, 
    d.id,
    l.id,
    true
FROM departments d, levels l, programs p
WHERE d.code = 'INFO' 
  AND l.program_id = p.id 
  AND p.code = 'MGL' 
  AND l.year = 1 
  AND l.semester = 1;

INSERT INTO subjects (name, code, credits, coefficient, department_id, level_id, is_mandatory)
SELECT 
    'Tests et Qualité Logicielle', 
    'TQL', 
    5, 
    1.5, 
    d.id,
    l.id,
    true
FROM departments d, levels l, programs p
WHERE d.code = 'INFO' 
  AND l.program_id = p.id 
  AND p.code = 'MGL' 
  AND l.year = 1 
  AND l.semester = 1;

-- ============================================
-- 6. GROUPES
-- ============================================
-- Groupes L1 Informatique
INSERT INTO groups (name, code, level_id, capacity, current_students, description)
SELECT 
    'Groupe A', 
    'LIG-L1S1-A', 
    l.id, 
    35, 
    32,
    'Groupe A - L1 Informatique Semestre 1'
FROM levels l, programs p
WHERE l.program_id = p.id 
  AND p.code = 'LIG' 
  AND l.year = 1 
  AND l.semester = 1
ON CONFLICT (name, level_id) DO NOTHING;

INSERT INTO groups (name, code, level_id, capacity, current_students, description)
SELECT 
    'Groupe B', 
    'LIG-L1S1-B', 
    l.id, 
    35, 
    30,
    'Groupe B - L1 Informatique Semestre 1'
FROM levels l, programs p
WHERE l.program_id = p.id 
  AND p.code = 'LIG' 
  AND l.year = 1 
  AND l.semester = 1
ON CONFLICT (name, level_id) DO NOTHING;

INSERT INTO groups (name, code, level_id, capacity, current_students, description)
SELECT 
    'Groupe C', 
    'LIG-L1S1-C', 
    l.id, 
    35, 
    28,
    'Groupe C - L1 Informatique Semestre 1'
FROM levels l, programs p
WHERE l.program_id = p.id 
  AND p.code = 'LIG' 
  AND l.year = 1 
  AND l.semester = 1
ON CONFLICT (name, level_id) DO NOTHING;

-- Groupes L2
INSERT INTO groups (name, code, level_id, capacity, current_students, description)
SELECT 
    'Groupe A', 
    'LIG-L2S1-A', 
    l.id, 
    30, 
    28,
    'Groupe A - L2 Informatique Semestre 1'
FROM levels l, programs p
WHERE l.program_id = p.id 
  AND p.code = 'LIG' 
  AND l.year = 2 
  AND l.semester = 1
ON CONFLICT (name, level_id) DO NOTHING;

INSERT INTO groups (name, code, level_id, capacity, current_students, description)
SELECT 
    'Groupe B', 
    'LIG-L2S1-B', 
    l.id, 
    30, 
    25,
    'Groupe B - L2 Informatique Semestre 1'
FROM levels l, programs p
WHERE l.program_id = p.id 
  AND p.code = 'LIG' 
  AND l.year = 2 
  AND l.semester = 1
ON CONFLICT (name, level_id) DO NOTHING;

-- Groupes Master
INSERT INTO groups (name, code, level_id, capacity, current_students, description)
SELECT 
    'Groupe Unique', 
    'MGL-M1S1-U', 
    l.id, 
    25, 
    22,
    'Groupe unique - M1 Génie Logiciel'
FROM levels l, programs p
WHERE l.program_id = p.id 
  AND p.code = 'MGL' 
  AND l.year = 1 
  AND l.semester = 1
ON CONFLICT (name, level_id) DO NOTHING;

-- ============================================
-- 7. SALLES
-- ============================================
-- Amphithéâtres
INSERT INTO rooms (code, name, capacity, room_type_id, building, floor, has_projector, description)
SELECT 
    'AMPHI-A', 
    'Amphithéâtre A', 
    200, 
    rt.id, 
    'Bâtiment Principal', 
    0,
    true,
    'Grand amphithéâtre équipé'
FROM room_types rt WHERE rt.name = 'Amphithéâtre'
ON CONFLICT (code) DO NOTHING;

INSERT INTO rooms (code, name, capacity, room_type_id, building, floor, has_projector, description)
SELECT 
    'AMPHI-B', 
    'Amphithéâtre B', 
    150, 
    rt.id, 
    'Bâtiment Principal', 
    0,
    true,
    'Amphithéâtre moyen'
FROM room_types rt WHERE rt.name = 'Amphithéâtre'
ON CONFLICT (code) DO NOTHING;

INSERT INTO rooms (code, name, capacity, room_type_id, building, floor, has_projector, description)
SELECT 
    'AMPHI-C', 
    'Amphithéâtre C', 
    100, 
    rt.id, 
    'Bâtiment Sciences', 
    1,
    true,
    'Petit amphithéâtre'
FROM room_types rt WHERE rt.name = 'Amphithéâtre'
ON CONFLICT (code) DO NOTHING;

-- Salles TD
INSERT INTO rooms (code, name, capacity, room_type_id, building, floor, has_projector, description)
SELECT 
    'TD-101', 
    'Salle TD 101', 
    40, 
    rt.id, 
    'Bâtiment Informatique', 
    1,
    true,
    'Salle de travaux dirigés'
FROM room_types rt WHERE rt.name = 'Salle TD'
ON CONFLICT (code) DO NOTHING;

INSERT INTO rooms (code, name, capacity, room_type_id, building, floor, has_projector, description)
SELECT 
    'TD-102', 
    'Salle TD 102', 
    40, 
    rt.id, 
    'Bâtiment Informatique', 
    1,
    true,
    'Salle de travaux dirigés'
FROM room_types rt WHERE rt.name = 'Salle TD'
ON CONFLICT (code) DO NOTHING;

INSERT INTO rooms (code, name, capacity, room_type_id, building, floor, has_projector, description)
SELECT 
    'TD-201', 
    'Salle TD 201', 
    35, 
    rt.id, 
    'Bâtiment Informatique', 
    2,
    true,
    'Salle de travaux dirigés'
FROM room_types rt WHERE rt.name = 'Salle TD'
ON CONFLICT (code) DO NOTHING;

INSERT INTO rooms (code, name, capacity, room_type_id, building, floor, has_projector, description)
SELECT 
    'TD-202', 
    'Salle TD 202', 
    35, 
    rt.id, 
    'Bâtiment Informatique', 
    2,
    true,
    'Salle de travaux dirigés'
FROM room_types rt WHERE rt.name = 'Salle TD'
ON CONFLICT (code) DO NOTHING;

-- Laboratoires Informatique
INSERT INTO rooms (code, name, capacity, room_type_id, building, floor, has_projector, has_computers, description)
SELECT 
    'LAB-INFO-1', 
    'Laboratoire Informatique 1', 
    30, 
    rt.id, 
    'Bâtiment Informatique', 
    1,
    true,
    true,
    'Labo équipé de 30 PC'
FROM room_types rt WHERE rt.name = 'Laboratoire Informatique'
ON CONFLICT (code) DO NOTHING;

INSERT INTO rooms (code, name, capacity, room_type_id, building, floor, has_projector, has_computers, description)
SELECT 
    'LAB-INFO-2', 
    'Laboratoire Informatique 2', 
    30, 
    rt.id, 
    'Bâtiment Informatique', 
    2,
    true,
    true,
    'Labo équipé de 30 PC'
FROM room_types rt WHERE rt.name = 'Laboratoire Informatique'
ON CONFLICT (code) DO NOTHING;

INSERT INTO rooms (code, name, capacity, room_type_id, building, floor, has_projector, has_computers, description)
SELECT 
    'LAB-INFO-3', 
    'Laboratoire Informatique 3', 
    25, 
    rt.id, 
    'Bâtiment Informatique', 
    2,
    true,
    true,
    'Labo équipé de 25 PC - TP Réseaux'
FROM room_types rt WHERE rt.name = 'Laboratoire Informatique'
ON CONFLICT (code) DO NOTHING;

-- Salles TP
INSERT INTO rooms (code, name, capacity, room_type_id, building, floor, has_projector, description)
SELECT 
    'TP-301', 
    'Salle TP 301', 
    25, 
    rt.id, 
    'Bâtiment Sciences', 
    3,
    true,
    'Salle de travaux pratiques'
FROM room_types rt WHERE rt.name = 'Salle TP'
ON CONFLICT (code) DO NOTHING;

INSERT INTO rooms (code, name, capacity, room_type_id, building, floor, has_projector, description)
SELECT 
    'TP-302', 
    'Salle TP 302', 
    25, 
    rt.id, 
    'Bâtiment Sciences', 
    3,
    true,
    'Salle de travaux pratiques'
FROM room_types rt WHERE rt.name = 'Salle TP'
ON CONFLICT (code) DO NOTHING;

-- Salles de Conférence
INSERT INTO rooms (code, name, capacity, room_type_id, building, floor, has_projector, description)
SELECT 
    'CONF-1', 
    'Salle de Conférence 1', 
    80, 
    rt.id, 
    'Bâtiment Principal', 
    2,
    true,
    'Salle de conférence moderne'
FROM room_types rt WHERE rt.name = 'Salle de Conférence'
ON CONFLICT (code) DO NOTHING;

INSERT INTO rooms (code, name, capacity, room_type_id, building, floor, has_projector, description)
SELECT 
    'CONF-2', 
    'Salle de Conférence 2', 
    50, 
    rt.id, 
    'Bâtiment Principal', 
    2,
    true,
    'Petite salle de conférence'
FROM room_types rt WHERE rt.name = 'Salle de Conférence'
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- AFFICHAGE DES STATISTIQUES
-- ============================================
DO $$
DECLARE
    dept_count INTEGER;
    prog_count INTEGER;
    level_count INTEGER;
    subject_count INTEGER;
    group_count INTEGER;
    room_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO dept_count FROM departments;
    SELECT COUNT(*) INTO prog_count FROM programs;
    SELECT COUNT(*) INTO level_count FROM levels;
    SELECT COUNT(*) INTO subject_count FROM subjects;
    SELECT COUNT(*) INTO group_count FROM groups;
    SELECT COUNT(*) INTO room_count FROM rooms;
    
    RAISE NOTICE '============================================';
    RAISE NOTICE 'INSERTION DES DONNEES TERMINEE AVEC SUCCES !';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Departements:  % inseres', dept_count;
    RAISE NOTICE 'Programmes:    % inseres', prog_count;
    RAISE NOTICE 'Niveaux:       % inseres', level_count;
    RAISE NOTICE 'Matieres:      % inserees', subject_count;
    RAISE NOTICE 'Groupes:       % inseres', group_count;
    RAISE NOTICE 'Salles:        % inserees', room_count;
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Vous pouvez maintenant tester votre application !';
END $$;
