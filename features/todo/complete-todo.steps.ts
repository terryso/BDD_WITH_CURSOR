import { Then } from '@cucumber/cucumber';
import assert from 'assert';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(__dirname, '../..');
const dataFile = path.join(projectRoot, '.todo-data.json');

interface Todo {
  id: number;
  content: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

interface TodoData {
  todos: Todo[];
  lastId: number;
}

Then('待办事项的状态应该更新为已完成', function () {
  const data: TodoData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  const todo = data.todos[0];
  assert.ok(todo.completed, '待办事项应该被标记为已完成');
  assert.ok(todo.completedAt, '待办事项应该有完成时间');
}); 
