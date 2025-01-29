"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// 用于在测试环境中共享数据的内存存储
let memoryStore = {
    todos: [],
    lastId: 0
};
class TodoService {
    constructor(options = {}) {
        this.todos = [];
        this.lastId = 0;
        if (typeof options === 'string') {
            options = { dataFile: options };
        }
        this.inMemory = options.inMemory || false;
        this.storageFile = options.dataFile || path_1.default.join(process.cwd(), '.todo-data.json');
        if (this.inMemory) {
            // 使用共享的内存存储
            this.todos = memoryStore.todos;
            this.lastId = memoryStore.lastId;
        }
        else {
            this.loadFromFile();
        }
    }
    loadFromFile() {
        try {
            if (fs_1.default.existsSync(this.storageFile)) {
                const fileContent = fs_1.default.readFileSync(this.storageFile, 'utf-8');
                const data = JSON.parse(fileContent, (key, value) => {
                    if (key === 'createdAt' || key === 'completedAt' || key === 'deadline') {
                        return value ? new Date(value) : undefined;
                    }
                    return value;
                });
                this.todos = data.todos;
                this.lastId = data.lastId;
            }
        }
        catch (error) {
            console.error('加载数据失败:', error);
            this.todos = [];
            this.lastId = 0;
        }
    }
    saveToFile() {
        if (this.inMemory) {
            // 更新共享的内存存储
            memoryStore.todos = [...this.todos];
            memoryStore.lastId = this.lastId;
            return;
        }
        try {
            const dir = path_1.default.dirname(this.storageFile);
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir, { recursive: true, mode: 0o755 });
            }
            const tempFile = `${this.storageFile}.tmp`;
            fs_1.default.writeFileSync(tempFile, JSON.stringify({
                todos: this.todos,
                lastId: this.lastId
            }), { encoding: 'utf-8', mode: 0o644 });
            fs_1.default.renameSync(tempFile, this.storageFile);
        }
        catch (error) {
            console.error('保存数据失败:', error);
            throw error;
        }
    }
    // 仅用于测试：重置内存存储
    static resetMemoryStore() {
        memoryStore = {
            todos: [],
            lastId: 0
        };
    }
    add(options) {
        const { content, deadline } = options;
        if (!content || content.trim() === '') {
            throw new Error('待办事项内容不能为空');
        }
        const trimmedContent = content.trim();
        if (trimmedContent.length > 100) {
            throw new Error('待办事项内容长度不能超过100字符');
        }
        // 检查是否存在重复内容
        const existingTodo = this.todos.find(todo => todo.content === trimmedContent);
        if (existingTodo) {
            throw new Error('待办事项已存在');
        }
        // 验证截止日期
        if (deadline) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const deadlineDate = new Date(deadline);
            deadlineDate.setHours(0, 0, 0, 0);
            if (deadlineDate < now) {
                throw new Error('截止日期必须是未来的日期');
            }
        }
        const todo = {
            id: ++this.lastId,
            content: trimmedContent,
            completed: false,
            createdAt: new Date(),
            deadline: deadline
        };
        this.todos.push(todo);
        this.saveToFile();
        return todo;
    }
    complete(id) {
        if (id === undefined) {
            throw new Error('请提供待办事项ID');
        }
        // 验证ID格式
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('待办事项ID必须为正整数');
        }
        const todo = this.todos.find(t => t.id === id);
        if (!todo) {
            throw new Error('待办事项不存在');
        }
        if (todo.completed) {
            throw new Error('待办事项已完成');
        }
        todo.completed = true;
        todo.completedAt = new Date();
        this.saveToFile();
        return todo;
    }
    list(options = {}) {
        let result = [...this.todos];
        if (options.sortBy === 'deadline') {
            result = this.sortByDeadline(result, options.order || 'asc');
        }
        return result;
    }
    sortByDeadline(todos, order) {
        // 首先按完成状态分组
        const uncompletedTodos = todos.filter(t => !t.completed);
        const completedTodos = todos.filter(t => t.completed);
        // 对未完成的待办事项进行排序
        const uncompletedWithDeadline = uncompletedTodos.filter(t => t.deadline);
        const uncompletedWithoutDeadline = uncompletedTodos.filter(t => !t.deadline);
        // 按截止日期排序（有截止日期的待办事项）
        uncompletedWithDeadline.sort((a, b) => {
            // 确保日期对象是有效的 Date 实例
            const aDate = a.deadline instanceof Date ? a.deadline : new Date(a.deadline);
            const bDate = b.deadline instanceof Date ? b.deadline : new Date(b.deadline);
            const compareResult = aDate.getTime() - bDate.getTime();
            // 如果截止日期相同，按创建时间排序
            if (compareResult === 0) {
                const aCreatedAt = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
                const bCreatedAt = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
                return aCreatedAt.getTime() - bCreatedAt.getTime();
            }
            return order === 'asc' ? compareResult : -compareResult;
        });
        // 无截止日期的待办事项按创建时间排序
        uncompletedWithoutDeadline.sort((a, b) => {
            const aCreatedAt = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
            const bCreatedAt = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
            return aCreatedAt.getTime() - bCreatedAt.getTime();
        });
        // 已完成的待办事项按完成时间降序排序
        completedTodos.sort((a, b) => {
            const aCompletedAt = a.completedAt instanceof Date ? a.completedAt : new Date(a.completedAt);
            const bCompletedAt = b.completedAt instanceof Date ? b.completedAt : new Date(b.completedAt);
            return bCompletedAt.getTime() - aCompletedAt.getTime();
        });
        // 组合排序结果：未完成（有截止日期） > 未完成（无截止日期） > 已完成
        return [
            ...uncompletedWithDeadline,
            ...uncompletedWithoutDeadline,
            ...completedTodos
        ];
    }
    delete(id) {
        if (id === undefined) {
            throw new Error('请提供待办事项ID');
        }
        // 验证ID格式
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('待办事项ID必须为正整数');
        }
        const index = this.todos.findIndex(t => t.id === id);
        if (index === -1) {
            throw new Error('待办事项不存在');
        }
        // 删除并返回待办事项
        const deletedTodo = this.todos[index];
        this.todos.splice(index, 1);
        this.saveToFile();
        return deletedTodo;
    }
    reset(id) {
        if (id === undefined) {
            throw new Error('请提供待办事项ID');
        }
        // 验证ID格式
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('待办事项ID必须为正整数');
        }
        const todo = this.todos.find(t => t.id === id);
        if (!todo) {
            throw new Error('待办事项不存在');
        }
        if (!todo.completed) {
            throw new Error('待办事项未完成');
        }
        // 重置状态
        todo.completed = false;
        todo.completedAt = undefined;
        this.saveToFile();
        return todo;
    }
    completeBatch(ids) {
        if (!ids || ids.length === 0) {
            throw new Error('请提供待办事项ID');
        }
        // 验证ID格式
        if (ids.some(id => !Number.isInteger(id) || id <= 0)) {
            throw new Error('待办事项ID必须为正整数');
        }
        const validTodos = [];
        const invalidIds = [];
        // 收集有效的待办事项
        for (const id of ids) {
            const todo = this.todos.find(t => t.id === id);
            if (todo && !todo.completed) {
                validTodos.push(todo);
            }
            else if (!todo) {
                invalidIds.push(id);
            }
        }
        // 如果没有可完成的待办事项，抛出错误
        if (validTodos.length === 0) {
            if (invalidIds.length > 0) {
                throw new Error(`ID为 [${invalidIds.join(', ')}] 的待办事项不存在或已完成`);
            }
            throw new Error('没有可完成的有效待办事项');
        }
        // 批量完成待办事项
        const completedTodos = validTodos.map(todo => {
            todo.completed = true;
            todo.completedAt = new Date();
            return todo;
        });
        this.saveToFile();
        return completedTodos;
    }
    completeAll() {
        // 获取所有未完成的待办事项
        const uncompletedTodos = this.todos.filter(t => !t.completed);
        if (uncompletedTodos.length === 0) {
            if (this.todos.length === 0) {
                throw new Error('当前没有待办事项');
            }
            throw new Error('当前没有未完成的待办事项');
        }
        // 设置完成时间（所有待办事项使用相同的完成时间）
        const completedAt = new Date();
        // 批量完成所有未完成的待办事项
        const completedTodos = uncompletedTodos.map(todo => {
            todo.completed = true;
            todo.completedAt = completedAt;
            return todo;
        });
        this.saveToFile();
        return completedTodos;
    }
    update(todo) {
        const index = this.todos.findIndex(t => t.id === todo.id);
        if (index === -1) {
            throw new Error('待办事项不存在');
        }
        this.todos[index] = todo;
        this.saveToFile();
        return todo;
    }
}
exports.TodoService = TodoService;
