export interface Todo {
	task: string;
	deadline: Date;
	isCompleted: boolean;
}

export interface TodoBucket {
	page: number;
	count: number;
	todos: Array<Todo>;
}
