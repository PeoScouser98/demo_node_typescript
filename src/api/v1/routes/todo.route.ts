import express from "express";
import * as TodoController from "../controllers/todo.controller";
const router = express.Router();

router.get("/todos", TodoController.list);
router.get("/todos/:page", TodoController.listByPage);
router.put("/todos", TodoController.create);
router.patch("/todos/update/:taskId", TodoController.update);
router.patch("/todos/delete/:taskId", TodoController.remove);

export default router;
