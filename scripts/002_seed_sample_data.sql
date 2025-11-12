-- Insert sample garbage reports for Pune
insert into public.garbage_reports (location_name, latitude, longitude, description, severity, status)
values
  ('Koregaon Park', 18.5362, 73.8958, 'Large pile of garbage near the park entrance. Needs immediate attention.', 'high', 'pending'),
  ('Shivajinagar', 18.5304, 73.8467, 'Overflowing dustbin on the main road.', 'medium', 'pending'),
  ('Deccan Gymkhana', 18.5165, 73.8420, 'Scattered plastic waste around the bus stop.', 'low', 'pending'),
  ('Viman Nagar', 18.5679, 73.9143, 'Illegal dumping site discovered behind the residential area.', 'high', 'in-progress'),
  ('Baner', 18.5590, 73.7779, 'Street littering and garbage accumulation near the market.', 'medium', 'resolved'),
  ('Kothrud', 18.5074, 73.8077, 'Open garbage dump attracting stray animals.', 'high', 'pending'),
  ('Pimple Saudagar', 18.5987, 73.8030, 'Construction debris left on the roadside.', 'medium', 'pending'),
  ('Hadapsar', 18.5089, 73.9260, 'Garbage not collected for over a week in residential area.', 'high', 'in-progress');
