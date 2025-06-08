CREATE TABLE "DeviceData" ( id BIGSERIAL PRIMARY KEY, device_id UUID NOT NULL, temperature FLOAT, humid
ity FLOAT, pressure FLOAT, co FLOAT, methane FLOAT, lpg FLOAT, pm25 FLOAT, pm10 FLOAT, noise FLOAT, light FLOAT, recorde
d_at BIGINT DEFAULT (EXTRACT(EPOCH FROM NOW())::BIGINT) );

INSERT INTO "DeviceData" (
  device_id, temperature, humidity, pressure, co, methane, lpg, pm25, pm10, noise, light, recorded_at
) VALUES (
  'c8f7d435-09cd-41a2-982f-b57b46075c8a',
  24.5, 60.2, 1013.25, 0.03, 0.01, 0.02, 12.5, 30.8, 55.0, 300.0,
  EXTRACT(EPOCH FROM NOW())::BIGINT
);