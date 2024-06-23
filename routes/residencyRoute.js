import express from "express";
import { createResidency, getAllResidencies, getResidencyById } from "../controllers/resdCntrl.js";

const router = express.Router();

router.post('/create', createResidency)
router.get('/allresd', getAllResidencies)
router.get('/:id', getResidencyById)

export { router as residencyRoute }