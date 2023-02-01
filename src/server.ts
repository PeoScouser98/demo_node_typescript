import connectMongoDB from "./config/mongoDB.config";

import app from "./app";

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
	console.log(`[SUCCESS] Server is listening on port ${PORT}`);
});
connectMongoDB();
