import express from "express";
import videoRoutes from "./routes/video.routes";

const app = express();
app.use(express.json());

app.use("/api/videos", videoRoutes);

app.listen(3000, () => console.log("Server rodando"));