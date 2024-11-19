import express from "express";
import { createStock } from "../controllers/stockController";
import { getAllstocks } from "../controllers/stockController";
import { updateStockController } from "../controllers/stockController";
import uploadImage from "../middleware/UploadImage";
import access from "../middleware/access";

const router = express.Router();

router.route("/").post(access("admin"), uploadImage, createStock);
router.route("/").get(access("admin"), getAllstocks);
router.route("/:id").put(access("admin"), uploadImage, updateStockController);
export default router;
