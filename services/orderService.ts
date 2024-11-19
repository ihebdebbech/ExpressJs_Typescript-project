import { PrismaClient, Order } from "@prisma/client";
const order = new PrismaClient().order;

export const createOrder = async (orderRequest: Order) => {
  try {
    return await order.create({
      data: orderRequest,
    });
  } catch (error) {
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    return await order.findMany({
      orderBy: {
        id: "asc",
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getOrdersByYearService = async (year: number) => {
  if (!year) {
    throw new Error("L'année est requise");
  }

  const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
  const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

  const orders = await order.findMany({
    where: {
      orderDate: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const ordersPerMonth = new Array(12).fill(0);

  orders.forEach((order) => {
    const monthIndex = order.orderDate.getMonth();
    ordersPerMonth[monthIndex]++;
  });

  const result = months.map((month, index) => ({
    month: month,
    numberOfOrders: ordersPerMonth[index],
  }));

  return result;
};

export const getOrdersByRoomsSizesService = async () => {
  try {
    const orders = await order.findMany();

    let smallRoomsCount = 0;
    let mediumRoomsCount = 0;
    let largeRoomsCount = 0;

    orders.forEach((order) => {
      order.roomSizes.forEach((size) => {
        if (size >= 0 && size < 200) {
          smallRoomsCount++;
        } else if (size >= 200 && size < 500) {
          mediumRoomsCount++;
        } else if (size >= 500) {
          largeRoomsCount++;
        }
      });
    });

    return {
      smallRooms: smallRoomsCount,
      mediumRooms: mediumRoomsCount,
      largeRooms: largeRoomsCount,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
};
