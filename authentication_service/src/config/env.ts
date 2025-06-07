import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    username: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "changeme",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
};
