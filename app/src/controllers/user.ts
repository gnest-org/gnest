import { Request, Response, NextFunction } from "express";
import { Controller, Route } from "../decorators";
import { CreateUser, GetUser, Role } from "../models";
import { authorize } from "../middleware";
import { userService } from "../services";

@Controller('/users')
export class UsersController {
  @Route('get', '/get/all', authorize([Role.ADMIN]))
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      logging.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
      return res.status(500).json({ message: errorMessage });
    }
  }

  @Route('get', '/get/:id', authorize([Role.ADMIN, Role.USER]))
  async getById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id as any as number;
    try {
      const user = await userService.getUserById(id);
      if (!user) return res.status(404).json({ message: 'Not Found' });
      return res.status(200).json(user);
    } catch (error) {
      logging.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
      return res.status(500).json({ message: errorMessage });
    }
  }

  @Route('post', '/create', authorize([Role.ADMIN]))
  async create(req: Request, res: Response) {
    const newUsers = req.body as CreateUser[];
    try {
      const usersCreated = await userService.createUser(newUsers);
      if (!usersCreated || usersCreated instanceof Error) 
        return res.status(400).json({ message: 'Users creation failed' });
      return res.status(200).json(usersCreated);
    } catch (error) {
      logging.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
      res.status(500).json({ message: errorMessage });
    }
  }

  @Route('get', '/query', authorize([Role.ADMIN]))
  async getUserByQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getUserByQuery(req.query);
      if (!users) return res.status(404).json({ message: 'Not Found' });
      return res.status(200).json(users);
    } catch (error) {
      logging.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
      return res.status(500).json({ message: errorMessage });
    }
  }

  @Route('patch', '/update/:id', authorize([Role.ADMIN, Role.USER]))
  async update(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id as any as number;
    try {
      const user = await userService.updateUser(id, req.body);
      if (!user) return res.status(404).json({ message: 'Not Found' });
      return res.status(200).json(user);
    } catch (error) {
      logging.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
      return res.status(500).json({ message: errorMessage });
    }
  }

  @Route('delete', '/delete/:id', authorize([Role.ADMIN]))
  async delete(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id as any as number;
    try {
      const isDeleted = await userService.deleteUser(id);
      if (!isDeleted) return res.status(404).json({ message: 'Not Found' });
      return res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
      logging.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
      return res.status(500).json({ message: errorMessage });
    }
  }
}
