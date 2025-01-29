import { Then } from '@cucumber/cucumber';
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { testDataFile } from '../support/common.steps';

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

Then('待办事项应该从列表中删除', function () {
  const data: TodoData = JSON.parse(fs.readFileSync(testDataFile, 'utf-8'));
  const todos = data.todos;
  assert.strictEqual(todos.length, 0, '待办事项应该已被删除');
});

Then('待办事项应该被成功删除', function () {
  const data: TodoData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  assert.strictEqual(data.todos.length, 0, '待办事项应该已被删除');
}); 