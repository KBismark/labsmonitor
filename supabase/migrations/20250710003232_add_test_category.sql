-- Add test_category column to test_records table
ALTER TABLE test_records 
ADD COLUMN test_category VARCHAR NOT NULL DEFAULT 'GENERAL';

-- Add index on test_category for better query performance
CREATE INDEX idx_test_records_category ON test_records(test_category);

-- Add notes column to test_records table
ALTER TABLE test_records 
ADD COLUMN notes TEXT;

-- Update test_panels table to include display_name and is_active
ALTER TABLE test_panels 
ADD COLUMN display_name VARCHAR NOT NULL DEFAULT '';

ALTER TABLE test_panels 
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

-- Add updated_at column to test_panels table
ALTER TABLE test_panels 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create trigger to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_test_panels_updated_at 
    BEFORE UPDATE ON test_panels 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some default test panels
INSERT INTO test_panels (name, display_name, description, tests, is_active) VALUES
('CBC', 'Complete Blood Count', 'Complete blood count panel including red blood cells, white blood cells, and platelets', '["RBC", "HB", "PLATELETS", "WBC"]', true),
('KFT', 'Kidney Function Test', 'Kidney function tests including electrolytes and waste products', '["POTASSIUM", "UREA", "CREATININE", "eGFR"]', true),
('LFT', 'Liver Function Test', 'Liver function tests including enzymes and proteins', '["ALT", "AST", "ALP", "GGT", "T-BIL", "D-BIL", "TOTAL PROTEIN", "ALBUMIN"]', true),
('LIPID', 'Lipid Panel', 'Cholesterol and triglyceride measurements', '["T. CHOL", "HDL", "LDL", "TRIG", "NON-HDL CHOL"]', true),
('GLUCOSE', 'Glucose Panel', 'Blood sugar and related measurements', '["GLUCOSE", "HBA1C", "INSULIN", "LACTATE"]', true),
('IRON', 'Iron Studies', 'Iron metabolism and storage tests', '["IRON", "TRANSFERRI", "FERRITIN", "IRON SATURATION"]', true),
('THYROID', 'Thyroid Function', 'Thyroid hormone measurements', '["TSH", "T3", "T4"]', true),
('URINE', 'Urine Analysis', 'Urine composition and sediment analysis', '["PROTEIN", "BLOOD", "BACTERIA", "SG", "GLUCOSE"]', true),
('FERTILITY', 'Fertility Panel', 'Hormonal tests for fertility assessment', '["FSH", "LH", "PROLACTIN", "ESTROGEN", "PROGESTERONE", "AMH", "TESTOSTERONE"]', true),
('ELECTROLYTES', 'Electrolyte Panel', 'Basic electrolyte measurements', '["SODIUM", "POTASSIUM", "CHLORIDE"]', true)
ON CONFLICT (name) DO NOTHING; 