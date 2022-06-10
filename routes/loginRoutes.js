import { Router } from "express";

import { signup, signin } from "../controllers/loginControllers.js";

const loginRoutes = Router();

loginRoutes.post('/signup', signup);
loginRoutes.post('/signin', signin);

export default loginRoutes;