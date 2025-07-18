import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await AuthService.register(name, email, password);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};

export const listAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await AuthService.getAllUsers();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, password, is_active } = req.body;
    const user = await AuthService.updateUser(id, name, password, is_active);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};