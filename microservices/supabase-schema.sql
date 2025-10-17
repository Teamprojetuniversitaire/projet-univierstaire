-- ============================================
-- SCHÉMA DE BASE DE DONNÉES SUPABASE
-- Système de Gestion du Référentiel Universitaire
-- ============================================

-- Supprimer les tables existantes (ordre inverse des dépendances)
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS levels CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS room_types CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- ============================================
-- TABLE: departments (Départements)
-- ============================================
CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(50) UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE departments IS 'Table des départements académiques';
COMMENT ON COLUMN departments.name IS 'Nom du département (unique)';
COMMENT ON COLUMN departments.code IS 'Code court du département';

-- ============================================
-- TABLE: room_types (Types de salles)
-- ============================================
CREATE TABLE room_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE room_types IS 'Types de salles (Amphithéâtre, TD, TP, etc.)';

-- ============================================
-- TABLE: programs (Programmes/Spécialités)
-- ============================================
CREATE TABLE programs (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    department_id BIGINT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    duration_years INTEGER DEFAULT 3,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(name, department_id)
);

COMMENT ON TABLE programs IS 'Programmes d''études / Spécialités';
COMMENT ON COLUMN programs.duration_years IS 'Durée en années (Licence=3, Master=2)';

CREATE INDEX idx_programs_department ON programs(department_id);

-- ============================================
-- TABLE: levels (Niveaux)
-- ============================================
CREATE TABLE levels (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    year INTEGER NOT NULL CHECK (year >= 1 AND year <= 5),
    semester INTEGER CHECK (semester IN (1, 2)),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(program_id, year, semester)
);

COMMENT ON TABLE levels IS 'Niveaux d''études (L1, L2, L3, M1, M2)';
COMMENT ON COLUMN levels.year IS 'Année d''étude (1-5)';
COMMENT ON COLUMN levels.semester IS 'Semestre (1 ou 2)';

CREATE INDEX idx_levels_program ON levels(program_id);

-- ============================================
-- TABLE: subjects (Matières)
-- ============================================
CREATE TABLE subjects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    credits INTEGER DEFAULT 3 CHECK (credits >= 1 AND credits <= 10),
    coefficient DECIMAL(3,1) DEFAULT 1.0,
    department_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
    level_id BIGINT REFERENCES levels(id) ON DELETE SET NULL,
    description TEXT,
    is_mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE subjects IS 'Matières enseignées';
COMMENT ON COLUMN subjects.credits IS 'Crédits ECTS (1-10)';
COMMENT ON COLUMN subjects.coefficient IS 'Coefficient de la matière';
COMMENT ON COLUMN subjects.is_mandatory IS 'Matière obligatoire ou optionnelle';

CREATE INDEX idx_subjects_department ON subjects(department_id);
CREATE INDEX idx_subjects_level ON subjects(level_id);

-- ============================================
-- TABLE: groups (Groupes)
-- ============================================
CREATE TABLE groups (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE,
    level_id BIGINT NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
    capacity INTEGER DEFAULT 30 CHECK (capacity > 0),
    current_students INTEGER DEFAULT 0 CHECK (current_students >= 0),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(name, level_id)
);

COMMENT ON TABLE groups IS 'Groupes d''étudiants';
COMMENT ON COLUMN groups.capacity IS 'Capacité maximale du groupe';
COMMENT ON COLUMN groups.current_students IS 'Nombre actuel d''étudiants';

CREATE INDEX idx_groups_level ON groups(level_id);

-- Trigger pour vérifier la capacité
CREATE OR REPLACE FUNCTION check_group_capacity()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.current_students > NEW.capacity THEN
        RAISE EXCEPTION 'Le nombre d''étudiants (%) dépasse la capacité (%)', 
            NEW.current_students, NEW.capacity;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_group_capacity
    BEFORE INSERT OR UPDATE ON groups
    FOR EACH ROW
    EXECUTE FUNCTION check_group_capacity();

-- ============================================
-- TABLE: rooms (Salles)
-- ============================================
CREATE TABLE rooms (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255),
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    room_type_id BIGINT REFERENCES room_types(id) ON DELETE SET NULL,
    building VARCHAR(100),
    floor INTEGER,
    has_projector BOOLEAN DEFAULT false,
    has_computers BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE rooms IS 'Salles de cours';
COMMENT ON COLUMN rooms.code IS 'Code unique de la salle (ex: A101, B205)';
COMMENT ON COLUMN rooms.capacity IS 'Capacité en nombre de places';
COMMENT ON COLUMN rooms.building IS 'Bâtiment';
COMMENT ON COLUMN rooms.floor IS 'Étage';

CREATE INDEX idx_rooms_type ON rooms(room_type_id);
CREATE INDEX idx_rooms_building ON rooms(building);

-- ============================================
-- FONCTION: Mettre à jour updated_at automatiquement
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_types_updated_at BEFORE UPDATE ON room_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_levels_updated_at BEFORE UPDATE ON levels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VUES UTILES
-- ============================================
CREATE OR REPLACE VIEW v_programs_full AS
SELECT 
    p.id,
    p.name,
    p.code,
    p.duration_years,
    p.description,
    d.id AS department_id,
    d.name AS department_name,
    d.code AS department_code,
    p.created_at,
    p.updated_at
FROM programs p
INNER JOIN departments d ON p.department_id = d.id;

CREATE OR REPLACE VIEW v_groups_full AS
SELECT 
    g.id,
    g.name,
    g.code,
    g.capacity,
    g.current_students,
    g.description,
    l.id AS level_id,
    l.name AS level_name,
    l.year,
    l.semester,
    p.id AS program_id,
    p.name AS program_name,
    d.id AS department_id,
    d.name AS department_name,
    g.created_at,
    g.updated_at
FROM groups g
INNER JOIN levels l ON g.level_id = l.id
INNER JOIN programs p ON l.program_id = p.id
INNER JOIN departments d ON p.department_id = d.id;

CREATE OR REPLACE VIEW v_rooms_full AS
SELECT 
    r.id,
    r.code,
    r.name,
    r.capacity,
    r.building,
    r.floor,
    r.has_projector,
    r.has_computers,
    r.description,
    rt.id AS room_type_id,
    rt.name AS room_type_name,
    r.created_at,
    r.updated_at
FROM rooms r
LEFT JOIN room_types rt ON r.room_type_id = rt.id;

-- ============================================
-- MESSAGE DE SUCCÈS
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Schéma créé avec succès !';
    RAISE NOTICE 'Tables créées: departments, room_types, programs, levels, subjects, groups, rooms';
    RAISE NOTICE 'Vues créées: v_programs_full, v_groups_full, v_rooms_full';
END $$;
