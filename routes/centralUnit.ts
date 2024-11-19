import { Router } from "express";
import {
  affectCentral,
  getAllcentralUnits,
  updateCentralController,
  getCentralsPourcentageStatusController
} from "../controllers/centralUnitController";
import access from "../middleware/access";
const centralRouter = Router();
centralRouter.route("/updatecentralowner").put(access("technician"), affectCentral);
centralRouter.route("/").get(access("admin"), getAllcentralUnits);
centralRouter.route("/inactive").put(access("admin"), updateCentralController);
centralRouter.route("/statestic").get(access("admin"), getCentralsPourcentageStatusController);

export default centralRouter;
