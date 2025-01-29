#!/usr/bin/env node
import { TodoService } from './services/todoService';
import path from 'path';
import { formatDate } from './utils/dateFormatter';

interface ListOptions {
  sortBy?: 'deadline';
  order?: 'asc' | 'desc';
}

// 获取项目根目录和配置
const projectRoot = path.resolve(__dirname, '..');
const useMemoryStore = process.env.TODO_MEMORY_STORE === 'true';
const storageFile = process.env.TODO_DATA_FILE || path.join(projectRoot, '.todo-data.json');

const todoService = new TodoService({
  dataFile: storageFile,
  inMemory: useMemoryStore
});

function validateDate(dateStr: string): Date | null {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    return null;
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function getRemainingDays(deadline: Date): number {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  
  // 设置时间为当天的开始（00:00:00）
  now.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  
  // 计算时间差（毫秒）
  const diffTime = deadlineDate.getTime() - now.getTime();
  
  // 转换为天数（向上取整）
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

async function main() {
  const [action, ...args] = process.argv.slice(2);

  try {
    switch (action) {
      case 'add':
        let content = args[0];
        let deadline: Date | undefined;

        // 解析参数
        const deadlineIndex = args.indexOf('--deadline');
        if (deadlineIndex !== -1 && args[deadlineIndex + 1]) {
          const dateStr = args[deadlineIndex + 1];
          const date = validateDate(dateStr);
          if (!date) {
            throw new Error('截止日期格式无效，请使用 YYYY-MM-DD 格式');
          }
          deadline = date;
          // 从参数列表中移除 --deadline 和日期值
          content = args.slice(0, deadlineIndex).join(' ');
        } else if (deadlineIndex !== -1) {
          throw new Error('请提供截止日期');
        } else {
          content = args.join(' ');
        }

        if (!content) {
          throw new Error('待办事项内容不能为空');
        }

        const todo = todoService.add({ content, deadline });
        console.log('已添加新的待办事项:');
        console.log(`编号: ${todo.id}`);
        console.log(`内容: '${todo.content}'`);
        console.log(`创建时间: ${formatDate(todo.createdAt)}`);
        if (todo.deadline) {
          console.log(`截止日期: ${formatDate(todo.deadline).split(' ')[0]}`);
          console.log(`剩余天数: ${getRemainingDays(todo.deadline)}天`);
        }
        console.log(`状态: ${todo.completed ? '已完成' : '未完成'}`);
        break;

      case 'complete':
        if (!args[0]) {
          throw new Error('请提供待办事项ID');
        }
        const id = parseInt(args[0], 10);
        if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
          throw new Error('待办事项ID必须为正整数');
        }
        const completedTodo = todoService.complete(id);
        console.log('已将待办事项标记为完成:');
        console.log(`编号: ${completedTodo.id}`);
        console.log(`内容: '${completedTodo.content}'`);
        console.log(`完成时间: ${formatDate(completedTodo.completedAt!)}`);
        console.log(`状态: 已完成`);
        break;

      case 'delete':
        if (!args[0]) {
          throw new Error('请提供待办事项ID');
        }
        const deleteId = parseInt(args[0], 10);
        if (isNaN(deleteId) || !Number.isInteger(deleteId) || deleteId <= 0) {
          throw new Error('待办事项ID必须为正整数');
        }
        const deletedTodo = todoService.delete(deleteId);
        console.log('已删除待办事项:');
        console.log(`编号: ${deletedTodo.id}`);
        console.log(`内容: '${deletedTodo.content}'`);
        break;

      case 'reset':
        if (!args[0]) {
          throw new Error('请提供待办事项ID');
        }
        const resetId = parseInt(args[0], 10);
        if (isNaN(resetId) || !Number.isInteger(resetId) || resetId <= 0) {
          throw new Error('待办事项ID必须为正整数');
        }
        const originalTodo = todoService.list().find(t => t.id === resetId);
        const originalCompletedAt = originalTodo?.completedAt;
        const resetTodo = todoService.reset(resetId);
        console.log('已重置待办事项状态:');
        console.log(`编号: ${resetTodo.id}`);
        console.log(`内容: '${resetTodo.content}'`);
        console.log(`原完成时间: ${formatDate(originalCompletedAt!)}`);
        console.log(`当前状态: 未完成`);
        break;

      case 'list':
        const sortByDeadline = args.includes('--sort-by-deadline');
        const isDesc = args.includes('--desc');
        const listOptions: ListOptions = sortByDeadline ? { sortBy: 'deadline', order: isDesc ? 'desc' : 'asc' } : {};
        
        const todos = todoService.list(listOptions);
        if (todos.length === 0) {
          console.log('暂无待办事项');
        } else {
          console.log('待办事项列表:');
          todos.forEach(t => {
            console.log(`\n编号: ${t.id}`);
            console.log(`内容: '${t.content}'`);
            console.log(`创建时间: ${formatDate(t.createdAt)}`);
            if (t.deadline) {
              const deadline = t.deadline instanceof Date ? t.deadline : new Date(t.deadline);
              console.log(`截止日期: ${formatDate(deadline).split(' ')[0]}`);
              console.log(`剩余天数: ${getRemainingDays(deadline)}天`);
            }
            if (t.completed && t.completedAt) {
              const completedAt = t.completedAt instanceof Date ? t.completedAt : new Date(t.completedAt);
              console.log(`完成时间: ${formatDate(completedAt)}`);
            }
            console.log(`状态: ${t.completed ? '已完成' : '未完成'}`);
          });
        }
        break;

      case 'complete-batch':
        if (!args || args.length === 0) {
          throw new Error('请提供待办事项ID');
        }
        const ids = args.map(arg => {
          const id = parseInt(arg, 10);
          if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
            throw new Error('待办事项ID必须为正整数');
          }
          return id;
        });
        const completedTodos = todoService.completeBatch(ids);
        console.log('已批量完成待办事项：\n');
        completedTodos.forEach(todo => {
          console.log(`编号: ${todo.id}`);
          console.log(`内容: '${todo.content}'`);
          console.log(`完成时间: ${formatDate(todo.completedAt!)}`);
          console.log(`状态: 已完成\n`);
        });
        const invalidIds = ids.filter(id => !completedTodos.find(t => t.id === id));
        if (invalidIds.length > 0) {
          console.log(`注意：ID为 [${invalidIds.join(', ')}] 的待办事项不存在，已忽略`);
        }
        break;

      default:
        console.error('未知的命令');
        process.exit(1);
    }
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
}

main(); 
