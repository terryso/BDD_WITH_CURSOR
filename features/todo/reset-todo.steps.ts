import { Then } from '@cucumber/cucumber';
import assert from 'assert';
import { commandOutput, testDataFile } from '../support/common.steps';
import fs from 'fs';

interface Todo {
  id: number;
  content: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

interface TodoData {
  todos: Todo[];
  currentId: number;
}

function readTodoData(): TodoData {
  try {
    return JSON.parse(fs.readFileSync(testDataFile, 'utf-8')) as TodoData;
  } catch (error) {
    return { todos: [], currentId: 0 };
  }
}

Then('待办事项的状态应该更新为未完成', function () {
  const data = readTodoData();
  const todos = data.todos;
  
  // 获取命令输出中的待办事项ID
  const idMatch = commandOutput.match(/编号: (\d+)\n/);
  const expectedId = idMatch ? parseInt(idMatch[1], 10) : 0;
  
  const todo = todos.find(t => t.id === expectedId);
  assert.ok(todo, '待办事项未找到');
  assert.strictEqual(todo.completed, false, '待办事项状态未更新为未完成');
  assert.strictEqual(todo.completedAt, undefined, '完成时间未被清除');
}); 