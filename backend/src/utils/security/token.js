import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
export const generateToken = ({ payload = {}, signature, expiresIn }) => {
  return jwt.sign(payload, signature, { expiresIn });
};
export const verifyToken = ({ token, signature }) => {
  return jwt.verify(token, signature);
};

export const compareHash = ({ plainText, hashValue }) => {
  return bcrypt.compareSync(plainText, hashValue);
};