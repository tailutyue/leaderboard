-- Insert cafe data
INSERT INTO "Cafe" ("name", "location", "recyclingRate", "cupsRecycled", "trend", "website", "wasteReduction", "compostProduced", "contaminationRate", "rank")
VALUES
  ('Green Bean Coffee', 'Downtown', 85.5, 1250, 1, 'https://greenbean.cafe', 45.2, 120.5, 3.2, 1),
  ('Eco Brew', 'Westside', 82.3, 980, -1, 'https://ecobrew.com', 42.8, 98.3, 4.1, 2),
  ('Sustainable Sips', 'East End', 79.8, 850, 1, 'https://sustainablesips.co', 38.5, 88.7, 3.8, 3),
  ('Coffee Planet', 'North Square', 77.2, 720, 0, 'https://coffeeplanet.org', 35.2, 75.4, 4.5, 4),
  ('The Daily Grind', 'South Market', 75.5, 650, -1, 'https://dailygrind.cafe', 33.8, 68.9, 4.8, 5),
  ('Bean & Gone', 'Harbor View', 73.8, 580, 1, 'https://beangone.com', 31.5, 62.3, 5.1, 6),
  ('Cup of Joy', 'Central Park', 71.2, 510, 0, 'https://cupofjoy.net', 29.8, 55.8, 5.4, 7),
  ('Morning Fix', 'West End', 69.5, 450, -1, 'https://morningfix.cafe', 27.5, 48.2, 5.7, 8),
  ('Cafe Verde', 'Riverside', 67.8, 380, 1, 'https://cafeverde.org', 25.2, 42.5, 6.0, 9),
  ('Urban Coffee Lab', 'Downtown', 65.2, 320, 0, 'https://urbancoffeelab.com', 23.8, 38.7, 6.3, 10);

-- Insert historical data
INSERT INTO "HistoricalData" ("totalCafes", "cafesChange", "totalCups", "cupsChange", "averageRate", "rateChange", "topPerformer", "topPerformerRate", "date")
VALUES
  (10, 2, 6690, 450, 74.78, 1.2, 'Green Bean Coffee', 85.5, '2024-03-01'),
  (8, -1, 6240, -120, 73.58, -0.5, 'Green Bean Coffee', 84.8, '2024-02-01'),
  (9, 1, 6360, 380, 74.08, 0.8, 'Eco Brew', 83.2, '2024-01-01'),
  (8, 0, 5980, 220, 73.28, 0.4, 'Sustainable Sips', 82.5, '2023-12-01'),
  (8, 1, 5760, 280, 72.88, 0.6, 'Coffee Planet', 81.8, '2023-11-01'),
  (7, 0, 5480, 180, 72.28, 0.3, 'The Daily Grind', 80.2, '2023-10-01');

-- Insert insights data
INSERT INTO "Insights" ("cupsRecycled", "co2Saved", "wasteDiverted", "date")
VALUES
  (450, 45.0, 18.0, '2024-03-01'),
  (420, 42.0, 16.8, '2024-02-01'),
  (380, 38.0, 15.2, '2024-01-01'),
  (350, 35.0, 14.0, '2023-12-01'),
  (320, 32.0, 12.8, '2023-11-01'),
  (280, 28.0, 11.2, '2023-10-01'); 