import { Request, Response } from "express";
import * as TodoServices from "../services/todo.service";
import createHttpErrors, { HttpError } from "http-errors";

export const listByPage = async (req: Request, res: Response) => {
	try {
		const pageQuery = +!req.query.page || 1;
		const todos = await TodoServices.getTodoBucketByPage(pageQuery as number);
		if (!todos) throw createHttpErrors.NotFound("Cannot find todo");
		return res.status(200).json(todos);
	} catch (error) {
		const err = error as HttpError;
		return res.status(404).json({
			status: err.status,
			message: err.message,
		});
	}
};

export const create = async (req: Request, res: Response) => {
	try {
		console.log("request data:>>>>", req.body.task);
		if (!req.body) throw createHttpErrors.BadRequest("Todo must be provided!");
		const newTodo = await TodoServices.insertIntoTodoBucket(req.body);
		if (!newTodo) throw createHttpErrors.InternalServerError("Failed to create new todo");
		return res.status(201).json(newTodo);
		// handle logic ...
	} catch (error: any) {
		const err = error as HttpError;
		return res.status(500).json({
			status: err.status,
			message: err.message,
		});
	}
};

export const update = async (req: Request, res: Response) => {
	try {
		if (!req.body) throw createHttpErrors.BadRequest("Todo must be provided!");
		const updatedTodo = await TodoServices.updateTodoBucket(+req.params.taskId, req.body);
		if (!updatedTodo) throw createHttpErrors.NotFound("Cannot find todo to update");
		return res.status(201).json(updatedTodo);
	} catch (error) {
		const err = error as HttpError;
		return res.status(500).json({
			status: err.status,
			message: err.message,
		});
	}
};

export const remove = async (req: Request, res: Response) => {
	try {
		const afterRemoved = await TodoServices.deleteTodoBucket(+req.params.taskId);
		return res.status(200).json(afterRemoved);
	} catch (error) {
		const err = error as HttpError;
		return res.status(500).json({
			status: err.status,
			message: err.message,
		});
	}
};