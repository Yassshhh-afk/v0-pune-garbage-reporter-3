-- Insert realistic garbage reports with images for Pune & Pimpri-Chinchwad
-- These are based on real locations showing serious garbage issues

INSERT INTO public.garbage_reports (location_name, latitude, longitude, description, severity, status, photo_url) VALUES

-- Pune - High Severity Reports
('Aundh Main Road', 18.5667, 73.8167, 'Massive garbage dump blocking the main road. Mixed waste including plastic bags, broken furniture, and textile waste. Needs immediate cleanup. Animals seen scavenging. Serious health hazard to residents.', 'high', 'pending', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Punekars-are-frustrated-with-the-poor-garbage-mana_1727812000920.webp-hW7BYT2ULw4UgPVtTY7q3wjYnZ2WW1.jpeg'),

('Yerawada Junction', 18.5837, 73.8952, 'Large garbage pile at the junction with broken bottles, metal scraps, and organic waste. Causing traffic congestion and foul smell. Multiple complaints from nearby shops.', 'high', 'pending', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%281%29-gJICsecdVkgnzuPxedAW082Er4kJQT.jpeg'),

('Mominpura, Bhosari', 18.6301, 73.8887, 'Textile and cloth waste dumped near residential area. Serious environmental concern. Waste is blocking drainage system. Residents report respiratory issues.', 'high', 'pending', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pune--India---March-01--2020-Garbage-at-Mominpura-_1754075455256.webp-KxBp79RfpzQ8wOF9pyJETC8EbmSpzg.jpeg'),

('Shaniwar Peth Market Area', 18.5134, 73.8473, 'Plastic containers, food waste, and packaging materials piled on street. Attracts insects and rodents. Market area flooded with garbage after daily operations.', 'high', 'pending', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-1Reoyvi471e7ulRkgJdZ9X7LbKEfZN.jpeg'),

-- Pune - Medium Severity Reports
('Kondhwa Road', 18.4947, 73.8750, 'Garbage accumulation on roadside near construction site. Mostly construction debris mixed with household waste. Needs segregation and proper disposal.', 'medium', 'in-progress', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%282%29-BnTFuS5MsJaXkXSl2YLndjOanbLQCS.jpeg'),

('Wakad Residential Area', 18.5892, 73.9195, 'Residential waste not collected for 3 days. Overflowing dustbins causing neighborhood issues. Need regular collection schedule.', 'medium', 'pending', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%283%29-uv1jvbGutVMlDxSUHEiJsQpkSUh5Rt.jpeg'),

('Hinjewadi Phase 1', 18.5934, 73.9779, 'IT park area with food waste and office waste accumulation. Regular cleaning needed at designated spots.', 'medium', 'resolved', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo-kMF88v9A01v9SR8kMvwx3dfcNF2E00.avif'),

('Baner Main Road', 18.5664, 73.8106, 'Street garbage causing visual pollution. Mix of plastic waste and broken items affecting neighborhood appeal.', 'medium', 'pending', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%285%29-qZPxaFK9r5NrYKXgKOHvsoqkwWQffY.jpeg'),

-- Pimpri-Chinchwad - High Severity Reports
('Nigdi MIDC Area', 18.6369, 73.8078, 'Industrial waste mixed with household garbage. Serious environmental hazard. Chemical waste suspected. Urgent intervention required.', 'high', 'pending', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp-Image-2024-02-26-at-11.08.50-AM-1024x643-WMikyP9c837AGSvTjyKUQ2bszCFav5.webp'),

('Bhosari Industrial Area', 18.6299, 73.8864, 'Large scale garbage dumping near residential boundary. Animal access to waste creating health concerns. Cow scavenging visible. Immediate cleanup needed.', 'high', 'pending', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%284%29-I1xULrrzYjcunv1NVwBhjjFxoB3ZOv.jpeg'),

-- Pimpri-Chinchwad - Medium Severity Reports
('Pimpri Main Road', 18.6349, 73.7994, 'Daily waste accumulation on main commercial road. Seasonal issue during peak hours. Traffic management affected by garbage dumps.', 'medium', 'in-progress', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Punekars-are-frustrated-with-the-poor-garbage-mana_1727812000920.webp-hW7BYT2ULw4UgPVtTY7q3wjYnZ2WW1.jpeg'),

('Chinchwad Residential Complex', 18.6387, 73.8186, 'Residential area garbage management issue. Bins overflowing on weekends. Need improved collection frequency.', 'medium', 'resolved', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%281%29-gJICsecdVkgnzuPxedAW082Er4kJQT.jpeg'),

-- Pune - Low Severity Reports (for variety)
('Kalyani Nagar Market', 18.5542, 73.8837, 'Minor garbage issue at market corner. Mostly cardboard and packaging waste from shops.', 'low', 'resolved', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo-kMF88v9A01v9SR8kMvwx3dfcNF2E00.avif');
