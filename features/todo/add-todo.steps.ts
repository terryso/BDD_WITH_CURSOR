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

Then('待办事项应该被成功添加', function () {
  const data: TodoData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  const todos = data.todos;
  assert.strictEqual(todos.length, 1, '待办事项列表应该只包含一条记录');
});

Then('我应该看到错误信息 {string}', function (expectedError: string) {
  const actualOutput = this.lastCommandOutput;
  assert.ok(actualOutput.includes(expectedError), 
    `期望错误信息包含: ${expectedError}, 实际输出: ${actualOutput}`);
});

Then('待办事项列表中应该包含这条新添加的记录', function () {
  const data: TodoData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  const todos = data.todos;
  assert.strictEqual(todos.length, 1, '待办事项列表应该只包含一条记录');
});

Then('待办事项列表应该为空', function () {
  const data: TodoData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  const todos = data.todos;
  assert.strictEqual(todos.length, 0, '待办事项列表应该为空');
});

Then('待办事项列表中应该只包含一条记录', function () {
  const data: TodoData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  const todos = data.todos;
  assert.strictEqual(todos.length, 1, '待办事项列表应该只包含一条记录');
}); 
