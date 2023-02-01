import { MongooseError } from "mongoose";
import { Todo, TodoBucket } from "../interfaces";
import TodoModel from "../models/todo.models";

// list all todo buckets
export const getTotalPages = async () => {
	try {
		const totalPage = await TodoModel.count({ count: { $gt: 0 } }).exec();
		return totalPage;
	} catch (error) {
		console.log(error);
		return error as MongooseError;
	}
};

// list todo by page
export const getTodoBucketByPage = async (pageIndex: number) => {
	try {
		return await TodoModel.findOne({ page: pageIndex }).exec();
	} catch (error) {
		return error as MongooseError;
	}
};

// add todo
export const insertIntoTodoBucket = async (todo: Todo) => {
	try {
		const totalPage = await TodoModel.count(); // get total page
		console.log(totalPage);
		return await TodoModel.findOneAndUpdate(
			{ count: { $lt: 5 } },
			{
				$push: { todos: todo },
				$inc: { count: 1 },
				$setOnInsert: {
					page: {
						valueOf: () => {
							return totalPage + 1;
						},
					},
				},
			},
			{
				upsert: true,
				new: true,
			},
		).exec();
	} catch (error) {
		return error as MongooseError;
	}
};

// update todo
export const updateTodoBucket = async (id: string, payload: Partial<Todo>) => {
	try {
		const updatedTodoBucket = await TodoModel.findOneAndUpdate(
			{ "todos._id": id },
			{ $set: { "todos.$": { _id: id, ...payload } } },
			{ new: true },
		).exec();

		console.log(updatedTodoBucket);
		return updatedTodoBucket;
	} catch (error: any) {
		return error as MongooseError;
		// handle errors
	}
};

// delete todo
export const deleteTodoBucket = async (id: string) => {
	try {
		const totalPage = await TodoModel.count(); // get total page
		// 1. remove todo from bucket
		const updatedTodoBucket = (await TodoModel.findOneAndUpdate(
			{ todos: { $elemMatch: { _id: id } } },
			{
				$pull: { todos: { _id: id } },
				$inc: { count: -1 },
			},
			{
				new: true,
			},
		).exec()) as unknown as TodoBucket;

		return updatedTodoBucket;
		// handle logic ...
	} catch (error) {
		return error as MongooseError;
	}
};
