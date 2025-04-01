import express from "express";
import userRoutes from "../../src/user/user.route.js";
import carBrandRoute from "../car/brand/brand.route.js";
import modelBrandRoute from "../car/model/model.route.js";
import serviceRoute from "../service/service.route.js";
import categoryRoute from "../category/category.route.js";
import appointmentRoute from "../appointment/appointment.route.js";
import taskRoute from "../task/task.route.js";
import pieceRoute from "../inventory/piece/piece.route.js";
import supplierRoute from "../inventory/supplier/supplier.route.js";
import supplierOrderRoute from "../inventory/supplier/order/order.route.js";
import transactionRoute from "../inventory/transaction/transaction.route.js";
import inventoryRoute from "../inventory/inventory.route.js"
import taskHistoryRoute from "../task-history/task-history.route.js";
import pieceCategorieRoute from "../inventory/piece/categories/piece-categorie.route.js"
import { requestLogger } from "./request-logger.js";
const app = express();
app.use(express.json());
app.use(requestLogger)

app.get("/", (req, res) => {
  res.send("ok");
});

app.use("/users", userRoutes);
app.use("/brand", carBrandRoute);
app.use("/model", modelBrandRoute);
app.use("/service", serviceRoute);
app.use("/category", categoryRoute);
app.use("/appointment", appointmentRoute);
app.use("/tasks", taskRoute);
app.use("/inventory/pieces", pieceRoute);
app.use("/inventory/pieces/categories", pieceCategorieRoute);
app.use("/inventory/supplier", supplierRoute);
app.use("/inventory/supplier/order", supplierOrderRoute);
app.use("/inventory/transactions", transactionRoute);
app.use("/inventory", inventoryRoute);
app.use('/tasks/histories', taskHistoryRoute)
export default app;
