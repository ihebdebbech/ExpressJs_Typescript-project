import { PrismaClient, Stock } from "@prisma/client";
const stock = new PrismaClient().stock;

export const createStockService = async (stockRequest: any) => {
  try {
    console.log(stockRequest);
    const price = parseFloat(stockRequest.price);
    const quantite = parseInt(stockRequest.quantite);
    return await stock.create({
      data: {
        name: stockRequest.name,
        category: stockRequest.category,
        price: price,
        image: stockRequest.image,
        quantite: quantite,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getAllStocks = async () => {
  try {
    return await stock.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  } catch (error) {
    throw error;
  }
};
export const decrementcentralStockService = async (
  name: string,
) => {
  try {
    const stockelement = await stock.findUnique({
      where: {
        name: name
      }
    });
    if (!stockelement) {
      const element = await stock.create({
        data: {
          name: "centralUnit",
          category: "hardware",
          price: 1000,
          image: "1726219746226.jpg",
          quantite: 1,
        },
      });
    }
    else {
      const element = await stock.update({
        where: { id: stockelement!.id },
        data: {

          quantite: stockelement.quantite!--,


        },
      });
      console.log(element);
      return element;
    }
  } catch (error) {
    console.error("Failed to update stock:", error);
    throw error;
  }
};
export const updatecentralStockService = async (
  name: string,

) => {
  try {
    const stockelement = await stock.findUnique({
      where: {
        name: name
      }
    });
    if (!stockelement) {
      const element = await stock.create({
        data: {
          name: "centralUnit",
          category: "hardware",
          price: 1000,
          image: "/uploads/1726219746226.jpg",
          quantite: 1,
        },
      });
    }
    else {
      const element = await stock.update({
        where: { id: stockelement!.id },
        data: {

          quantite: (stockelement!.quantite!) + 1,


        },
      });
      console.log(element);
      return element;
    }
  } catch (error) {
    console.error("Failed to update stock:", error);
    throw error;
  }
};

export const updateStockService = async (
  stockId: number,
  stockRequest: any
) => {
  try {
    const price = parseFloat(stockRequest.price);
    const quantite = parseInt(stockRequest.quantite);
    const element = await stock.update({
      where: { id: stockId },
      data: {
        name: stockRequest.name,
        category: stockRequest.category,
        price: price,
        quantite: quantite,
        image: stockRequest.image,

      },
    });
    console.log(element);
    return element;
  } catch (error) {
    console.error("Failed to update stock:", error);
    throw error;
  }
};
