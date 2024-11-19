import { Router } from "express";
import { createOrderController,getAllOrdersController,getOrdersByYearController,getOrdersByRommSizesController } from "../controllers/orderController";
import access from "../middleware/access";

const orderRouter = Router();
orderRouter.route("/").post(access("admin"), createOrderController);
orderRouter.route("/").get(access("admin"), getAllOrdersController);
orderRouter.route("/statestic").post(access("admin"), getOrdersByYearController);
orderRouter.route("/sizesStatestic").get(access("admin"), getOrdersByRommSizesController);
export default orderRouter;
