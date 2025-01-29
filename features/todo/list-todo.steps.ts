import { Then } from '@cucumber/cucumber';
import assert from 'assert';
import { testDataFile } from '../support/common.steps';
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

// 特定于列表功能的步骤定义
// 注意：其他通用步骤已移至 common.steps.ts 