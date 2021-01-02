import { Router } from "express";
import ImagesRouter from "./Images";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/images", ImagesRouter);

// Export the base-router
export default router;
