import { Router } from "express";
import { loginUser, registerUser, listAllUsers, updateUser } from "../controllers/auth.controller";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", listAllUsers);
router.put('/users/:id', updateUser);

export default router;
