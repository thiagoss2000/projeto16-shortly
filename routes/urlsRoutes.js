import { Router } from "express";

import { getUrls, getUrlsOpen, deleteUrls, postShorten } from "../controllers/urlsControllers.js";

const urlRoutes = Router();

urlRoutes.post('/urls/shorten', postShorten);
urlRoutes.get('/urls/:id', getUrls);
urlRoutes.get('/urls/open/:shortUrl', getUrlsOpen);
urlRoutes.delete('/urls/:id', deleteUrls);

export default urlRoutes;