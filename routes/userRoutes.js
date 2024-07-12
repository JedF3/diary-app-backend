import { Router } from "express";
import { signin, signup } from "../controllers/userControllers.js";

const baseURL="/api/v1/users";
const userRouter = Router();
userRouter.post(baseURL+"/signup", signup);
userRouter.post(baseURL+"/login", signin);

export default userRouter;