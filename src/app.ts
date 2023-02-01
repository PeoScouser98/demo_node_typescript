import express from "express";
import cors from "cors";
import morgan from "morgan";

// routers
import TodoRouter from "./api/v1/routes/todo.route";

const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

app.get("/", async (req, res) => {
	try {
		return res.status(200).json({
			status: 200,
			message: "Server now is running!",
		});
	} catch (error) {
		return res.json({});
	}
});

app.use("/v1/api", TodoRouter);

export default app;
