import { Given } from '@cucumber/cucumber';
import { execSync } from 'child_process';
import { testDataFile } from '../support/common.steps';
import fs from 'fs';

interface Todo {
  id: number;
  content: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  deadline?: Date;
}

interface TodoData {
  todos: Todo[];
  lastId: number;
}

Given('已经存在以下待办事项：', async function (dataTable) {
  const rows = dataTable.hashes();
  
  // 确保数据文件存在
  if (!fs.existsSync(testDataFile)) {
    fs.writeFileSync(testDataFile, JSON.stringify({ todos: [], lastId: 0 }));
  }
  
  for (const row of rows) {
    const { 内容, 截止日期, 状态 } = row;
    
    // 添加待办事项
    let command = `node dist/cli.js add '${内容}'`;
    if (截止日期 && 截止日期 !== '无') {
      command += ` --deadline ${截止日期}`;
    }
    
    try {
      // 添加待办事项
      execSync(command, {
        cwd: process.cwd(),
        env: {
          ...process.env,
          NODE_ENV: 'test',
          TODO_DATA_FILE: testDataFile
        },
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // 如果状态是已完成，则标记为完成
      if (状态 === '已完成') {
        // 从文件中读取数据
        const fileContent = fs.readFileSync(testDataFile, 'utf-8');
        const data = JSON.parse(fileContent, (key, value) => {
          if (key === 'createdAt' || key === 'completedAt' || key === 'deadline') {
            return value ? new Date(value) : value;
          }
          return value;
        });
        const lastId = data.lastId;
        
        // 标记为完成
        execSync(`node dist/cli.js complete ${lastId}`, {
          cwd: process.cwd(),
          env: {
            ...process.env,
            NODE_ENV: 'test',
            TODO_DATA_FILE: testDataFile
          },
          stdio: ['pipe', 'pipe', 'pipe']
        });
      }
    } catch (error: any) {
      throw new Error(`添加待办事项失败: ${error.message}\n${error.stderr?.toString() || ''}`);
    }
  }
}); 