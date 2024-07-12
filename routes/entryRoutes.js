import { Router } from "express";
import multer from "multer";
import { storage } from "../config/storage.js";
import { createEntry, deleteEntry, editEntries, viewEntries, viewLastEntry, viewOneEntry, viewPast7DaysEmotions } from "../controllers/entryControllers.js";
import { verifyAccessToken } from "../middleware/auth.middleware.js";


const baseURL="/api/v1/entries";
const entryImage = multer({storage});
const entryRouter = Router();
entryRouter.post(baseURL+"/addEntry", entryImage.single("entry-img"), verifyAccessToken,createEntry);
entryRouter.post(baseURL, verifyAccessToken, viewEntries)
entryRouter.post(baseURL+"/viewOne/:id", verifyAccessToken, viewOneEntry);
entryRouter.post(baseURL+"/recent/lastEntry", verifyAccessToken, viewLastEntry)
entryRouter.post(baseURL+"/trackEmotions/", verifyAccessToken, viewPast7DaysEmotions);
entryRouter.put(baseURL+"/edit/:id",entryImage.single("entry-img"), editEntries);
entryRouter.put(baseURL+"/delete/:id", deleteEntry);
export default entryRouter;