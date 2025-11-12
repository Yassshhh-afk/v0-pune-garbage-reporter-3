-- Update wards table with more accurate data and additional wards
DELETE FROM public.wards;

INSERT INTO public.wards (ward_name, address, phone, email, latitude, longitude) VALUES
('Aundh', 'Indo Brehman Chowk, Aundh Bodygate, Pune 411007', '020-25897982, 020-25897983', NULL, 18.5597, 73.8215),
('Kothrud', 'Golden Hind Building, Behind Paranjape School, Bhelkenagar Chowk, D.P. Road, Kothrud, Pune 411038', '020-25432621, 020-25432620', NULL, 18.5403, 73.8046),
('Ghole Road', 'Opposite PMC Press, Ghole Road, Pune 411004', '020-25511956, 020-25501500', NULL, 18.5297, 73.8506),
('Warje-Karvenagar', 'Swpnashilp Commercial Building, Warje, Pune 411038', '020-25432192, 020-25432193', NULL, 18.4952, 73.8078),
('Dhole-Patil Road', 'Near Madhuban Hotel / Dhole Patil Market, Dhole Patil Road, Pune 411001', '020-26141470, 020-26141472', NULL, 18.5366, 73.8558),
('Nagar Road', 'Nagar Road, Ramwadi, Pune 411014', '020-25509000, 020-26630103', NULL, 18.5735, 73.9006),
('Yerawada', 'Opposite Hotel Sargam, Yerawada, Pune 411006', '020-25509100', 'yerawada@punecorporation.org', 18.5837, 73.9125),
('Bhavani Peth', 'General Arun Kumar Vaidya Stadium Building, Bhavani Peth, Pune 411042', '020-26437040, 020-26437041', NULL, 18.5277, 73.8850),
('Kasaba Peth', '802, Sadashiv Peth, Near Shanipar, Pune 411030', '020-24431461', NULL, 18.5187, 73.8686),
('Tilak Road', 'Shivajirao Dhare Udyog Bhavan, Tilak Road, Pune', '020-25508000, 020-24431467', NULL, 18.5195, 73.8442),
('Sahakar Nagar', 'Utsav Building Corner, Near Market Yard Corner, Pune 411037', '020-24229768', NULL, 18.5451, 73.8724),
('Hadapsar', 'Near Pandit J. Nehru Market, Hadapsar, Pune 411028', '020-26821092, 020-26821093', NULL, 18.4703, 73.9089),
('Bibwewadi', 'Utsav Building Corner, 2nd Floor, Near Market Yard Corner, Pune 411037', '020-25508700, 020-24229768', NULL, 18.5100, 73.8900),
('Dhanakawadi-Katraj', 'Survey No.2 Behind Sawant Corner Building, Katraj, Pune 411046', '020-24317154, 020-24319147', NULL, 18.4422, 73.9021),
('Bavdhan', 'NDA Road, Near Chandani Chowk, Bavdhan, Pune', NULL, NULL, 18.5145, 73.7867),
('Pashan', 'Opp. B U Bhandari Showroom, Pashan Road, Pune 411008', NULL, NULL, 18.5701, 73.7937),
('Khadki', 'Near Lohemarg Police Station, Khadki Road, Khadaki, Pune 411020', NULL, NULL, 18.5625, 73.8891),
('Shivajinagar', 'PMC Main Building, Near Mangala Theatre, Shivajinagar, Pune 411005', '020-25501000, 020-25501111', 'info@punecorporation.org', 18.5249, 73.8442),
('Kondhwa-Wanawadi', 'Kondhwa-Wanawadi Ward Office, Pune', NULL, NULL, 18.4550, 73.9250),
('Vishrantwadi', 'Near Vishrantwadi Bus Stop, Alandi Road, Vishrantwadi, Pune 411049', NULL, NULL, 18.5900, 73.8600),
('Deccan', 'Kamla Nehru Park area, off Bhandarkar Road, Deccan, Pune', NULL, NULL, 18.5074, 73.8352);
