import { model, Schema } from "mongoose";

const todoSchema = new Schema(
	{
		count: {
			type: Number,
			default: 0,
		},
		page: {
			type: Number,
			default: 1,
		},
		todos: [
			{
				task: {
					type: String,
					trim: true,
					lowercase: true,
					require: true,
				},
				deadline: {
					type: Date,
					default: new Date(),
				},
				isCompleted: {
					type: Boolean,
					default: false,
				},
			},
		],
	},
	{
		timestamps: true,
	},
);

export default model("Todos", todoSchema);
