import { Router } from "express";

import { getUsers, getRanking } from "../controllers/usersControllers.js";

const usersRoutes = Router();

usersRoutes.get('/users/:id', getUsers);
usersRoutes.get('/ranking', getRanking);

export default usersRoutes;