import { Request, Response } from "express";
import { AppDataSource } from "../config";
import bcrypt from "bcrypt";
import User from "../entities/User";
import jwt from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);

const generateToken = (user: any) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
};
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await userRepository.findOneBy({ username });
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  console.log(user);
  const token = generateToken(user);
  return res.json({ token });
};

export const protectedRoute = (req: Request, res: Response) => {
  return res.json({ message: "This is protected" });
};
