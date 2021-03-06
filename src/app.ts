import express from "express";
import { createServer, Server } from "http";
import { PORT } from "./helpers/constant";
import cors from "cors";
import { connect } from "./configs/db";
import userRouter from "./routes/user-router";

const app = express();
const server: Server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cors());

app.use(userRouter);

server.listen(PORT, async () => {
    await connect();
    
    console.log("⚡️[DATABASE]: CONNECTED");
    console.log("⚡️[SERVER]: RUNNING");
    console.log("⚡️[PORT]: " + PORT);
    console.log("⚡️[MESSAGE]: エブリシングOK、頑張ってねー、エルトホルくん。ヽ(o＾▽＾o)ノ");
});
