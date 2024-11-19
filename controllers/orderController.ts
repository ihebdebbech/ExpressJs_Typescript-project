import { Request, Response } from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByYearService,
  getOrdersByRoomsSizesService,
} from "../services/orderService";
import { StatusCodes } from "http-status-codes";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    if (!orderData) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "required data" });
    }
    const order = await createOrder(orderData);
    return res.status(StatusCodes.ACCEPTED).json({ message: "created" });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred while creating order" });
  }
};

export const getAllOrdersController = async (req: Request, res: Response) => {
  try {
    const orders = await getAllOrders();
    console.log(orders);
    return res.status(StatusCodes.ACCEPTED).json(orders);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred while getting the orders" });
  }
};
export const getOrdersByYearController = async (
  req: Request,
  res: Response
) => {
  const { year } = req.body; // Recevoir l'année dans le corps de la requête

  try {
    if (!year || isNaN(year)) {
      return res
        .status(400)
        .json({ error: "Veuillez fournir une année valide." });
    }

    const result = await getOrdersByYearService(Number(year));

    return res.json(result);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des commandes par année:",
      error
    );
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getOrdersByRommSizesController = async (
  req: Request,
  res: Response
) => {
  try {
    const roomsSizesData = await getOrdersByRoomsSizesService();

    if (!roomsSizesData) {
      return res.status(404).json({ message: "No data found" });
    }

    return res.status(200).json(roomsSizesData);
  } catch (error) {
    console.error("Error fetching room sizes data:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
