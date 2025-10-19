// Indoor Environment Quality Limits
// Sources:
// - Temperature: 18-24°C (WHO Housing and Health Guidelines, 2011: https://www.who.int/publications/i/item/9789241501683)
// - Humidity: 30-60% RH (ASHRAE Standard 55: https://www.ashrae.org/technical-resources/bookstore/standard-55-thermal-environmental-conditions-for-human-occupancy)
// - Pressure: 950-1050 hPa (Typical atmospheric range: https://www.netatmo.com/weather-guide/atmospheric-pressure)
// - CO: <9 ppm (8-hour average, WHO Air Quality Guidelines: https://www.who.int/publications/i/item/9789240034228)
// - PM2.5: >15 µg/m³ (24-hour mean, WHO: https://www.who.int/news-room/feature-stories/detail/what-are-the-who-air-quality-guidelines)
// - PM10: >45 µg/m³ (24-hour mean, WHO: https://www.who.int/news-room/feature-stories/detail/what-are-the-who-air-quality-guidelines)
// - Noise: >35 dB(A) (Daytime indoor, WHO Community Noise Guidelines: https://www.who.int/europe/news-room/fact-sheets/item/noise)
// - Light: <100 lux (Minimum for general indoor areas, EN 12464: https://www.engineeringtoolbox.com/light-level-rooms-d_708.html)
// - Methane: >1000 ppm (OSHA PEL for hydrocarbons, adjusted for safety: https://www.osha.gov/chemicaldata/chemResult.html?RecNo=427)
// - LPG: >1000 ppm (Similar to methane, 10% LEL alarm threshold: https://www.nfpa.org/news-blogs-and-articles/blogs/2025/02/13/residential-fuel-gas-alarms-and-nfpa-715)

export const LIMITS = {
  temperature: { min: 18, max: 24 },
  humidity: { min: 30, max: 60 },
  pressure: { min: 950, max: 1050 },
  co: { max: 9 },
  methane: { max: 1000 },
  lpg: { max: 1000 },
  pm25: { max: 15 },
  pm10: { max: 45 },
  noise: { max: 35 },
  light: { min: 100 },
};