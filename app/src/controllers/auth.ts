import Joi from "joi";
import { CreateUser } from "../models";
import { authorize } from "../middleware";
import { Request, Response } from "express";
import { Controller, Route, Validate } from "../decorators";
import { registerUser, authenticateUser } from "../services";

const registerUserValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email(),
  password: Joi.string().required(),
  phone: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});

@Controller("/auth")
export class AuthController {
  @Route("post", "/register")
  @Validate(registerUserValidation)
  async register(req: Request, res: Response) {
    try {
      const user = req.body as any as CreateUser;
      if (user.password != user.confirmPassword)
        return res.status(405).json({ message: "Password not match" });
      const userCreated = await registerUser(user);
      return res.status(201).json({ message: "User registered", userCreated });
    } catch (error) {
      logging.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "Unexpected error";
      return res.status(400).json({ message: errorMessage });
    }
  }

  @Route("post", "/login")
  async login(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const { token } = await authenticateUser(name, email, password);
      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      logging.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "Unauthorized";
      return res.status(401).json({ message: errorMessage });
    }
  }

  @Route("get", "/whoami", authorize([]))
  async protectedRoute(req: Request, res: Response) {
    return res.status(200).json(req.user);
  }
}
