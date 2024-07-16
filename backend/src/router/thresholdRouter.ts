import { createThreshold,getThreshold } from "../controllers/threshold/index";
import { Router } from "express";

const router = Router();
router.post("/", createThreshold);
router.get("/", getThreshold);


export default router;