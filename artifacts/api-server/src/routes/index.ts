import { Router, type IRouter } from "express";
import healthRouter from "./health";
import uploadRouter from "./upload";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(uploadRouter);
router.use(contactRouter);

export default router;
