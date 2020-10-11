import express from "express";
import { createServer, Server } from "http";
import { PORT } from "./helpers/constant";
import cors from "cors";
import { connect } from "./configs/db";
import userRouter from "./routes/user-router";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import docs, { custom } from "./configs/docs";

const app = express();
const server: Server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cors());

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDoc(docs), custom));
app.use(userRouter);

server.listen(PORT, async () => {
    await connect();

    console.log("⚡️[DATABASE]: CONNECTED");
    console.log("⚡️[SERVER]: RUNNING");
    console.log("⚡️[PORT]: " + PORT);
});
