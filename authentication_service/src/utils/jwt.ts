import jwt from "jsonwebtoken";
import { config } from "../config/env";

export const generateToken = (payload: object): string => {
  return jwt.sign(
    payload,
    config.jwt.secret
  );
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, config.jwt.secret as jwt.Secret);
};
