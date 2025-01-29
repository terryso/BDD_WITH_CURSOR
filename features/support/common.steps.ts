import { Given, When, Then, Before } from '@cucumber/cucumber';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(__dirname, '../..');
export const testDataFile = path.join(projectRoot, '.todo-data.json');

declare module '@cucumber/cucumber' {
  interface World {
    lastCommandOutput: string;
  }
}

export let commandOutput = '';

Before(function () {
  // 确保数据文件存在
  if (fs.existsSync(testDataFile)) {
    fs.unlinkSync(testDataFile);
  }
  fs.writeFileSync(testDataFile, JSON.stringify({ todos: [], lastId: 0 }));
  commandOutput = '';
});

When('我执行命令 {string}', async function (command: string): Promise<void> {
  try {
    this.lastCommandOutput = execSync(command, {
      cwd: projectRoot,
      env: {
        ...process.env,
        NODE_ENV: 'test',
        TODO_DATA_FILE: testDataFile
      }
    }).toString();
    commandOutput = this.lastCommandOutput;
  } catch (error: any) {
    this.lastCommandOutput = error.stderr?.toString() || error.stdout?.toString() || error.message;
    commandOutput = this.lastCommandOutput;
  }
});

Then('我应该看到如下反馈信息：', async function (docString: string): Promise<void> {
  const actualOutput = this.lastCommandOutput;
  
  // 替换时间戳占位符
  const expectedOutput = docString.replace(/{current_time}/g, formatDate(new Date()));
  
  // 比较输出（忽略空白字符和时间戳）
  const normalizedExpected = expectedOutput.replace(/\s+/g, ' ').trim()
    .replace(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/g, '{timestamp}');
  const normalizedActual = actualOutput.replace(/\s+/g, ' ').trim()
    .replace(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/g, '{timestamp}');
  
  if (normalizedActual !== normalizedExpected) {
    throw new Error(`输出不匹配\n期望：${normalizedExpected}\n实际：${normalizedActual}`);
  }
});

Then('我应该看到如下反馈信息:', async function (docString: string): Promise<void> {
  const actualOutput = this.lastCommandOutput;
  
  // 替换时间戳占位符
  const expectedOutput = docString.replace(/{current_time}/g, formatDate(new Date()));
  
  // 比较输出（忽略空白字符和时间戳）
  const normalizedExpected = expectedOutput.replace(/\s+/g, ' ').trim()
    .replace(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/g, '{timestamp}');
  const normalizedActual = actualOutput.replace(/\s+/g, ' ').trim()
    .replace(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/g, '{timestamp}');
  
  if (normalizedActual !== normalizedExpected) {
    throw new Error(`输出不匹配\n期望：${normalizedExpected}\n实际：${normalizedActual}`);
  }
});

// 添加共享的步骤定义
Given('已经存在一条待办事项 {string}', function (content: string) {
  try {
    // 通过 CLI 添加测试数据
    execSync(`node dist/cli.js add '${content}'`, {
      cwd: process.cwd(),
      env: {
        ...process.env,
        NODE_ENV: 'test',
        TODO_DATA_FILE: testDataFile
      },
      stdio: ['pipe', 'pipe', 'pipe']
    });
  } catch (error: any) {
    throw new Error(`添加待办事项失败: ${error.message}\n${error.stderr?.toString() || ''}`);
  }
});

Given('而且已经存在一条待办事项 {string}', function (content: string) {
  try {
    // 通过 CLI 添加测试数据
    execSync(`node dist/cli.js add '${content}'`, {
      cwd: process.cwd(),
      env: {
        ...process.env,
        NODE_ENV: 'test',
        TODO_DATA_FILE: testDataFile
      },
      stdio: ['pipe', 'pipe', 'pipe']
    });
  } catch (error: any) {
    throw new Error(`添加待办事项失败: ${error.message}\n${error.stderr?.toString() || ''}`);
  }
});

// 辅助函数：格式化日期
function formatDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const utc8Date = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  return `${utc8Date.getFullYear()}-${pad(utc8Date.getMonth() + 1)}-${pad(utc8Date.getDate())} ${pad(utc8Date.getHours())}:${pad(utc8Date.getMinutes())}:${pad(utc8Date.getSeconds())}`;
} 
