import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "2h";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "2h";


export interface JwtPayload {
  id: string;
}


export const signAccessToken = (userId: string) => {
  return jwt.sign(
    {
      id: userId,
    },
    ACCESS_SECRET,
    {
      expiresIn: ACCESS_EXPIRES,
    } as jwt.SignOptions
  );
};


export const signRefreshToken = (userId: string) => {
  return jwt.sign(
    {
      id: userId,
    },
    REFRESH_SECRET,
    {
      expiresIn: REFRESH_EXPIRES,
    } as jwt.SignOptions
  );
};


export const verifyAccessToken = (token: string) => {
  return jwt.verify(
    token,
    ACCESS_SECRET
  ) as JwtPayload;
};


export const verifyRefreshToken = (token: string) => {
  return jwt.verify(
    token,
    REFRESH_SECRET
  ) as JwtPayload;
};