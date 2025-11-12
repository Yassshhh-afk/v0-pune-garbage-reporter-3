-- Add PCMC (Pimpri-Chinchwad) zone/ward offices to the wards table
INSERT INTO public.wards (ward_name, address, phone, email, latitude, longitude) VALUES
-- PCMC Zones
('A Zone Office', 'Bhel Chowk, Nigdi Pradhikaran, Nigdi-411044', '020-2764-6621, 9922501453', NULL, 18.6342, 73.9856),
('A'' Ward Office', 'Sector 27A, Pradhikaran, Nigdi, Pimpri-Chinchwad, Maharashtra 411044', '020-2765-0154', NULL, 18.6348, 73.9862),
('B Zone Office', 'Link Road, Elpro Company Campus, Chinchwad-411033', '020-2735-0153', NULL, 18.6245, 73.9512),
('B Ward Office (Chinchwad)', 'Near Chafekar Chowk, Chinchwad, Pune-411033', '020-2735-0153', NULL, 18.6289, 73.9487),
('C Zone Office (Civil)', 'Nehru Nagar, Bhosari, Pimpri-Chinchwad, Maharashtra', '020-2714-2503, 020-2714-2504', NULL, 18.6421, 73.9634),
('D Zone Office', 'Near Jagtap Dairy, Aundh-Ravet Road, Rahatani-411017', '020-2727-7898', NULL, 18.5897, 73.8934),
('Main PCMC Headquarters', 'Mumbai-Pune Road, Pimpri, Pune-411018', '020-2742-5511, 020-2742-5512, 020-2742-5513, 020-2742-5514', NULL, 18.6367, 73.8245);
