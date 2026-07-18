INSERT INTO businesses (id, name, color) VALUES 
('b_23labs', '23Labs', '#4F6BFF'),
('b_haylo', 'Haylo', '#12A594')
ON CONFLICT (id) DO NOTHING;
