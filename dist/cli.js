#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const todoService_1 = require("./services/todoService");
const path_1 = __importDefault(require("path"));
const dateFormatter_1 = require("./utils/dateFormatter");
// 获取项目根目录和配置
const projectRoot = path_1.default.resolve(__dirname, '..');
const useMemoryStore = process.env.TODO_MEMORY_STORE === 'true';
const storageFile = process.env.TODO_DATA_FILE || path_1.default.join(projectRoot, '.todo-data.json');
const todoService = new todoService_1.TodoService({
    dataFile: storageFile,
    inMemory: useMemoryStore
});
function validateDate(dateStr) {
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
function getRemainingDays(deadline) {
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
            case 'add': {
                let content = args[0];
                let deadline;
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
                }
                else if (deadlineIndex !== -1) {
                    throw new Error('请提供截止日期');
                }
                else {
                    content = args.join(' ');
                }
                if (!content) {
                    throw new Error('待办事项内容不能为空');
                }
                const todo = todoService.add({ content, deadline });
                console.log('已添加新的待办事项:');
                console.log(`编号: ${todo.id}`);
                console.log(`内容: '${todo.content}'`);
                console.log(`创建时间: ${(0, dateFormatter_1.formatDate)(todo.createdAt)}`);
                if (todo.deadline) {
                    console.log(`截止日期: ${(0, dateFormatter_1.formatDate)(todo.deadline).split(' ')[0]}`);
                    console.log(`剩余天数: ${getRemainingDays(todo.deadline)}天`);
                }
                console.log(`状态: ${todo.completed ? '已完成' : '未完成'}`);
                break;
            }
            case 'complete': {
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
                console.log(`完成时间: ${(0, dateFormatter_1.formatDate)(completedTodo.completedAt)}`);
                console.log(`状态: 已完成`);
                break;
            }
            case 'delete': {
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
            }
            case 'reset': {
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
                console.log(`原完成时间: ${(0, dateFormatter_1.formatDate)(originalCompletedAt)}`);
                console.log(`当前状态: 未完成`);
                break;
            }
            case 'list': {
                const sortByDeadline = args.includes('--sort-by-deadline');
                const isDesc = args.includes('--desc');
                const listOptions = sortByDeadline ? { sortBy: 'deadline', order: isDesc ? 'desc' : 'asc' } : {};
                const todoList = todoService.list(listOptions);
                if (todoList.length === 0) {
                    console.log('暂无待办事项');
                }
                else {
                    console.log('待办事项列表:');
                    todoList.forEach(t => {
                        console.log(`\n编号: ${t.id}`);
                        console.log(`内容: '${t.content}'`);
                        console.log(`创建时间: ${(0, dateFormatter_1.formatDate)(t.createdAt)}`);
                        if (t.deadline) {
                            const deadline = t.deadline instanceof Date ? t.deadline : new Date(t.deadline);
                            console.log(`截止日期: ${(0, dateFormatter_1.formatDate)(deadline).split(' ')[0]}`);
                            console.log(`剩余天数: ${getRemainingDays(deadline)}天`);
                        }
                        if (t.completed && t.completedAt) {
                            const completedAt = t.completedAt instanceof Date ? t.completedAt : new Date(t.completedAt);
                            console.log(`完成时间: ${(0, dateFormatter_1.formatDate)(completedAt)}`);
                        }
                        console.log(`状态: ${t.completed ? '已完成' : '未完成'}`);
                    });
                }
                break;
            }
            case 'complete-batch': {
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
                    console.log(`完成时间: ${(0, dateFormatter_1.formatDate)(todo.completedAt)}`);
                    console.log(`状态: 已完成\n`);
                });
                const invalidIds = ids.filter(id => !completedTodos.find(t => t.id === id));
                if (invalidIds.length > 0) {
                    console.log(`注意：ID为 [${invalidIds.join(', ')}] 的待办事项不存在，已忽略`);
                }
                break;
            }
            case 'complete-all': {
                try {
                    const completedTodos = todoService.completeAll();
                    console.log('已完成所有待办事项：\n');
                    completedTodos.forEach(todo => {
                        console.log(`编号: ${todo.id}`);
                        console.log(`内容: '${todo.content}'`);
                        console.log(`完成时间: ${(0, dateFormatter_1.formatDate)(todo.completedAt)}`);
                        console.log(`状态: 已完成\n`);
                    });
                    console.log(`共完成 ${completedTodos.length} 个待办事项`);
                }
                catch (error) {
                    console.log(error.message);
                }
                break;
            }
            case 'set-deadline': {
                if (!args[0]) {
                    throw new Error('请提供待办事项ID');
                }
                const todoId = parseInt(args[0], 10);
                if (isNaN(todoId) || !Number.isInteger(todoId) || todoId <= 0) {
                    throw new Error('待办事项ID必须为正整数');
                }
                if (!args[1]) {
                    throw new Error('请提供截止日期');
                }
                let newDeadline;
                if (args[1].toLowerCase() === 'none') {
                    newDeadline = undefined;
                }
                else {
                    const date = validateDate(args[1]);
                    if (!date) {
                        throw new Error('无效的日期格式，请使用 YYYY-MM-DD 格式');
                    }
                    newDeadline = date;
                }
                // 获取待办事项
                const targetTodo = todoService.list().find(t => t.id === todoId);
                if (!targetTodo) {
                    throw new Error('待办事项不存在');
                }
                // 验证日期是否是未来日期
                if (newDeadline) {
                    const now = new Date();
                    now.setHours(0, 0, 0, 0);
                    newDeadline.setHours(0, 0, 0, 0);
                    if (newDeadline < now) {
                        throw new Error('截止日期必须是未来的日期');
                    }
                }
                // 更新待办事项
                const updatedTodo = todoService.update({
                    ...targetTodo,
                    deadline: newDeadline
                });
                // 输出更新后的待办事项信息
                console.log('已更新待办事项：\n');
                console.log(`编号: ${updatedTodo.id}`);
                console.log(`内容: '${updatedTodo.content}'`);
                console.log(`截止日期: ${updatedTodo.deadline ? (0, dateFormatter_1.formatDate)(updatedTodo.deadline).split(' ')[0] : '无'}`);
                console.log(`状态: ${updatedTodo.completed ? '已完成' : '未完成'}`);
                break;
            }
            default:
                console.error('未知的命令');
                process.exit(1);
        }
    }
    catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}
main();
