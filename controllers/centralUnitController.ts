import { Request, Response } from "express";
import {
  affectCentralservice,
  createCentralService,
  getAllCentralUnitService,
  getCentralsPourcentageStatus,
  updateCentralService,
} from "../services/centralUnitService";
import { StatusCodes } from "http-status-codes";
import { decrementcentralStockService } from "../services/stockService";
export const affectCentral = async (req: Request, res: Response) => {
  try {
    const {uuid,email,latitude,longitude} = req.body;
    if (!uuid || !email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "required data" });
    }
    const central = await affectCentralservice(uuid,email,latitude,longitude);
    await decrementcentralStockService("centralUnit");
    return res.status(StatusCodes.ACCEPTED).json({ message: "affected" });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred while creating the central Unit" });
  }
};

export const getAllcentralUnits = async (req: Request, res: Response) => {
  try {
    const centralUnits = await getAllCentralUnitService();
    return res.status(StatusCodes.ACCEPTED).json(centralUnits);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred while getting the central unit" });
  }
};

export const updateCentralController = async (topic: string) => {
  try {
    const parts = topic.split("/");
    const uuid = parts[2];

    const updatedcentral = await updateCentralService(uuid);
    return updatedcentral;
  } catch (error) {
    return;
  }
};

export const getCentralsPourcentageStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const percentages = await getCentralsPourcentageStatus();

    if (percentages) {
      return res.status(200).json({
        message: "Pourcentage des centrals par statut récupéré avec succès",
        data: percentages,
      });
    } else {
      return res.status(404).json({
        message: "Aucun central trouvé ou une erreur est survenue",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des pourcentages",
    });
  }
};
