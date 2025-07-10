-- Initialize database with test data
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create test panels data
INSERT INTO test_panels (id, name, description, tests) VALUES
    (uuid_generate_v4(), 'CBC', 'Complete Blood Count', '["RBC", "HB", "PLATELETS", "WBC"]'),
    (uuid_generate_v4(), 'KFT', 'Kidney Function Test', '["POTASSIUM", "UREA", "CREATININE", "eGFR"]'),
    (uuid_generate_v4(), 'LFT', 'Liver Function Test', '["ALT", "AST", "ALP", "GGT", "T-BIL", "D-BIL", "TOTAL PROTEIN", "ALBUMIN"]'),
    (uuid_generate_v4(), 'LIPID', 'Lipid Profile', '["T. CHOL", "HDL", "LDL", "TRIG", "NON-HDL CHOL"]'),
    (uuid_generate_v4(), 'GLUCOSE', 'Glucose Panel', '["GLUCOSE", "HBA1C", "INSULIN", "LACTATE"]'),
    (uuid_generate_v4(), 'IRON', 'Iron Panel', '["IRON", "TRANSFERRI", "FERRITIN", "IRON SATURATION"]'),
    (uuid_generate_v4(), 'FLUID', 'Fluid Analysis', '["PROTEIN", "GLUCOSE", "LDH"]'),
    (uuid_generate_v4(), 'CARDIAC', 'Cardiac Enzymes', '["CPK", "AST", "LDH", "CKMB"]'),
    (uuid_generate_v4(), 'TROPININS', 'Tropinins', '["T. I", "T. T"]'),
    (uuid_generate_v4(), 'THYROID', 'Thyroid Function Test', '["TSH", "T3", "T4"]'),
    (uuid_generate_v4(), 'URINE', 'Urine Routine Examination', '["PROTEIN", "BLOOD", "BACTERIA", "SG", "GLUCOSE"]'),
    (uuid_generate_v4(), 'FERTILITY', 'Basic Fertilities', '["FSH", "LH", "PROLACTIN", "ESTROGEN", "PROGESTERONE", "AMH", "TESTOSTERONE"]'),
    (uuid_generate_v4(), 'ELECTROLYTES', 'Electrolytes', '["SODIUM", "POTASSIUM", "CHLORIDE"]'),
    (uuid_generate_v4(), 'SEMEN', 'Semen Analysis', '["Sperm concentration", "Motility", "Sperm count", "Viability"]'),
    (uuid_generate_v4(), 'ACR', 'ACR', '["Albumin", "Creatinine", "Ratio"]'),
    (uuid_generate_v4(), 'URINE_PROTEIN', 'Urine Protein Creatinine Ratio', '["URINE CREATININE", "URINE PROTEIN", "RATIO"]');