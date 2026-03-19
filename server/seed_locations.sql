-- ULTIMATE SEED SCRIPT: USA & CANADA
USE escort_db;

-- 1. CLEAR EXISTING (Optional, but safe if you're re-running)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE cities;
TRUNCATE TABLE states;
SET FOREIGN_KEY_CHECKS = 1;

-- 2. INSERT ALL STATES & PROVINCES
INSERT INTO states (name, code) VALUES 
-- USA (50)
('Alabama', 'AL'), ('Alaska', 'AK'), ('Arizona', 'AZ'), ('Arkansas', 'AR'), ('California', 'CA'),
('Colorado', 'CO'), ('Connecticut', 'CT'), ('Delaware', 'DE'), ('Florida', 'FL'), ('Georgia', 'GA'),
('Hawaii', 'HI'), ('Idaho', 'ID'), ('Illinois', 'IL'), ('Indiana', 'IN'), ('Iowa', 'IA'),
('Kansas', 'KS'), ('Kentucky', 'KY'), ('Louisiana', 'LA'), ('Maine', 'ME'), ('Maryland', 'MD'),
('Massachusetts', 'MA'), ('Michigan', 'MI'), ('Minnesota', 'MN'), ('Mississippi', 'MS'), ('Missouri', 'MO'),
('Montana', 'MT'), ('Nebraska', 'NE'), ('Nevada', 'NV'), ('New Hampshire', 'NH'), ('New Jersey', 'NJ'),
('New Mexico', 'NM'), ('New York', 'NY'), ('North Carolina', 'NC'), ('North Dakota', 'ND'), ('Ohio', 'OH'),
('Oklahoma', 'OK'), ('Oregon', 'OR'), ('Pennsylvania', 'PA'), ('Rhode Island', 'RI'), ('South Carolina', 'SC'),
('South Dakota', 'SD'), ('Tennessee', 'TN'), ('Texas', 'TX'), ('Utah', 'UT'), ('Vermont', 'VT'),
('Virginia', 'VA'), ('Washington', 'WA'), ('West Virginia', 'WV'), ('Wisconsin', 'WI'), ('Wyoming', 'WY'),
-- Canada (13)
('Ontario', 'ON'), ('Quebec', 'QC'), ('British Columbia', 'BC'), ('Alberta', 'AB'), ('Manitoba', 'MB'),
('Saskatchewan', 'SK'), ('Nova Scotia', 'NS'), ('New Brunswick', 'NB'), ('Newfoundland and Labrador', 'NL'),
('Prince Edward Island', 'PE'), ('Northwest Territories', 'NT'), ('Nunavut', 'NU'), ('Yukon', 'YT');

-- 3. INSERT MAJOR CITIES
INSERT INTO cities (state_id, name, slug) VALUES 
-- New York
((SELECT id FROM states WHERE code = 'NY'), 'New York City', 'new-york-city-ny'),
((SELECT id FROM states WHERE code = 'NY'), 'Buffalo', 'buffalo-ny'),
-- California
((SELECT id FROM states WHERE code = 'CA'), 'Los Angeles', 'los-angeles-ca'),
((SELECT id FROM states WHERE code = 'CA'), 'San Francisco', 'san-francisco-ca'),
-- Florida
((SELECT id FROM states WHERE code = 'FL'), 'Miami', 'miami-fl'),
((SELECT id FROM states WHERE code = 'FL'), 'Orlando', 'orlando-fl'),
-- Ontario, Canada
((SELECT id FROM states WHERE code = 'ON'), 'Toronto', 'toronto-on'),
((SELECT id FROM states WHERE code = 'ON'), 'Ottawa', 'ottawa-on'),
-- Quebec, Canada
((SELECT id FROM states WHERE code = 'QC'), 'Montreal', 'montreal-qc'),
((SELECT id FROM states WHERE code = 'QC'), 'Quebec City', 'quebec-city-qc'),
-- British Columbia, Canada
((SELECT id FROM states WHERE code = 'BC'), 'Vancouver', 'vancouver-bc'),
((SELECT id FROM states WHERE code = 'BC'), 'Victoria', 'victoria-bc'),
-- Alberta, Canada
((SELECT id FROM states WHERE code = 'AB'), 'Calgary', 'calgary-ab'),
((SELECT id FROM states WHERE code = 'AB'), 'Edmonton', 'edmonton-ab');

-- [You can add more cities following this pattern!]
