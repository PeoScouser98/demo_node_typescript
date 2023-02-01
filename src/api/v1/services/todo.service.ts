import { MongooseError } from "mongoose";
import { Todo, TodoBucket } from "../interfaces";
import TodoModel from "../models/todo.models";

// list all todo buckets
export const getAllTodoBuckets = async () => {
	try {
		const totalPage = await TodoModel.count();
		const buckets = await TodoModel.find().exec();
		return { totalPage, buckets };
	} catch (error) {
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
		);
	} catch (error) {
		return error as MongooseError;
	}
};

// update todo
export const updateTodoBucket = async (id: number, payload: Partial<Todo>) => {
	try {
		const updatedTodoBucket = await TodoModel.findOneAndUpdate(
			{ "todos.taskId": id },
			{ $set: { "todos.$": payload } },
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
export const deleteTodoBucket = async (id: number) => {
	try {
		const totalPage = await TodoModel.count(); // get total page
		// 1. remove todo from bucket
		const updatedTodoBucket = (await TodoModel.findOneAndUpdate(
			{ todos: { $elemMatch: { taskId: id } } },
			{
				$pull: { todos: { taskId: id } },
				$inc: { count: -1 },
			},
			{
				new: true,
			},
		)) as unknown as TodoBucket;
		// 2. if page has no todo -> delete bucket
		if (updatedTodoBucket.count === 0) {
			await TodoModel.findOneAndDelete({ count: 0 });
		}
		return updatedTodoBucket;
		// handle logic ...
	} catch (error) {
		return error as MongooseError;
	}
};
