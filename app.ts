import express, { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import http from "http";
import morgan from "morgan";
import authRouter from "./routes/authentication";
import authorization from "./middleware/authorization";
import centralRouter from "./routes/centralUnit";
import sensorDataRouter from "./routes/sensorData";
import roomRouter from "./routes/Room";
import stockRouter from "./routes/stock";
import orderRouter from "./routes/order";
import taskRouter from "./routes/task";
import userRouter from "./routes/users";
import notifRouter from "./routes/notifications";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { v4 } from "uuid"; // Import the v4 function from the uuid package
import { StatusCodes } from "http-status-codes";
import mqtt from "mqtt";
import { initializeMqttClient } from "./mqtt/mqttClient";
import sendPushNotification from "./middleware/notification";
import paymentRoutes from './routes/transaction';
import { paymentsuccess } from "./controllers/transactionController";
import cron from 'node-cron';
import { checkCallibrationdateEc, checkCallibrationdatePh } from "./services/roomService";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);



app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/generate-uuid", (req, res) => {
  try {
    const newUuid: string = v4(); // Generate a new UUID and type it as a string
    res.json({ uuid: newUuid });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  } // Send the UUID in the response
});
app.get('/successpage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'success.html'));
});
app.use("/auth", authRouter);

app.get('/payments/payment-success', paymentsuccess);
app.use(authorization);
app.use("/sensorData", sensorDataRouter);
app.use("/stock", stockRouter);
app.use("/task", taskRouter);
app.use("/user", userRouter);
app.use("/notif", notifRouter);
// Routes
app.use("/central-unit", centralRouter);
app.use('/payment', paymentRoutes);
app.use("/room", roomRouter);
app.get("/authorization", (req, res) => {
  return res.status(StatusCodes.ACCEPTED).send({ message: "authorized" });
});

app.use("/order", orderRouter);

// Set the port
app.set("port", 3000);

// Create HTTP server
const server = http.createServer(app);

server.listen(3000, () => {
  console.log("Connected to http://localhost:3000 ");
});

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});


initializeMqttClient("mqtt://localhost:1883");

  cron.schedule('*/15 * * * *', async () => {
    console.log('Checking room calibration at', new Date());
  
  
    try {
     // await checkCallibrationdatePh();
   // await checkCallibrationdateEc();
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  });
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.send("error");
});

export default app;




 