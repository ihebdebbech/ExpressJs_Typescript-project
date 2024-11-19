import { Request, Response } from "express";
import {
  createStockService,
  updateStockService,
} from "../services/stockService";
import { getAllStocks } from "../services/stockService";
import { StatusCodes } from "http-status-codes";

export const createStock = async (req: Request, res: Response) => {
  try {
    const stockData = req.body;
    console.log(stockData);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    if (!stockData) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "required data" });
    }
    const filePath = `/uploads/${req.file.filename}`;
    stockData.image = filePath;
    console.log("uploaded");
    const stock = await createStockService(stockData);
    return res.status(StatusCodes.ACCEPTED).json({ message: "created" });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred while creating the stock" });
  }
};

export const getAllstocks = async (req: Request, res: Response) => {
  try {
    const stocks = await getAllStocks();
    console.log(stocks);
    return res.status(StatusCodes.ACCEPTED).json(stocks);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred while getting the stock" });
  }
};

export const updateStockController = async (req: Request, res: Response) => {
  try {
    if (req.file) {
      const filePath = `/uploads/${req.file.filename}`;
      req.body.image = filePath;
    }

    const stockId = parseInt(req.params.id);
    const updatedStock = await updateStockService(stockId, req.body);
    res.status(200).json(updatedStock);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred while updating the stock" });
  }
};
