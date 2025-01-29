import { describe, it, expect, beforeEach } from 'vitest';
import { TodoService } from './todoService';
import fs from 'fs';
import path from 'path';

interface ListOptions {
  sortBy?: 'deadline';
  order?: 'asc' | 'desc';
}

interface Todo {
  id: number;
  content: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  deadline?: Date;
}

describe('TodoService', () => {
  let todoService: TodoService;
  const storageFile = path.join(process.cwd(), '.todo-test-data.json');

  beforeEach(() => {
    // 清理测试数据
    if (fs.existsSync(storageFile)) {
      fs.unlinkSync(storageFile);
    }
    todoService = new TodoService(storageFile);
  });

  describe('add', () => {
    it('应该成功添加一条待办事项', () => {
      const content = '完成用户故事编写';
      const todo = todoService.add({ content });

      expect(todo).toEqual({
        id: 1,
        content,
        completed: false,
        createdAt: expect.any(Date),
        deadline: undefined
      });
    });

    it('应该成功添加带截止日期的待办事项', () => {
      const content = '完成用户故事编写';
      const deadline = new Date('2025-12-31');
      const todo = todoService.add({ content, deadline });

      expect(todo).toEqual({
        id: 1,
        content,
        completed: false,
        createdAt: expect.any(Date),
        deadline: expect.any(Date)
      });

      // 验证截止日期
      expect(todo.deadline?.toISOString().split('T')[0]).toBe('2025-12-31');
    });

    it('应该成功添加不带截止日期的待办事项', () => {
      const content = '完成用户故事编写';
      const todo = todoService.add({ content });

      expect(todo).toEqual({
        id: 1,
        content,
        completed: false,
        createdAt: expect.any(Date),
        deadline: undefined
      });
    });

    it('当截止日期是过去的日期时应该抛出错误', () => {
      const content = '完成用户故事编写';
      const deadline = new Date('2020-12-31');
      
      expect(() => todoService.add({ content, deadline }))
        .toThrow('截止日期必须是未来的日期');
    });

    it('当内容为空时应该抛出错误', () => {
      expect(() => todoService.add({ content: '' })).toThrow('待办事项内容不能为空');
      expect(() => todoService.add({ content: '  ' })).toThrow('待办事项内容不能为空');
    });

    it('当内容超过100字符时应该抛出错误', () => {
      const longContent = '这是一段超过100字符的内容'.repeat(10); // 重复10次，确保超过100字符
      expect(() => todoService.add({ content: longContent }))
        .toThrow('待办事项内容长度不能超过100字符');
    });

    it('当添加重复内容时应该抛出错误', () => {
      const content = '完成用户故事编写';
      todoService.add({ content });
      expect(() => todoService.add({ content })).toThrow('待办事项已存在');

      // 验证列表中只有一条记录
      const todos = todoService.list();
      expect(todos).toHaveLength(1);
      expect(todos[0].content).toBe(content);
    });

    it('应该成功添加包含英文特殊字符的待办事项', () => {
      const content = '完成测试!@#$%^&*()';
      const todo = todoService.add({ content });

      expect(todo).toEqual({
        id: 1,
        content,
        completed: false,
        createdAt: expect.any(Date),
        deadline: undefined
      });

      // 验证存储的内容是否正确
      const todos = todoService.list();
      expect(todos).toHaveLength(1);
      expect(todos[0].content).toBe(content);
    });

    it('应该成功添加包含中文标点符号的待办事项', () => {
      const content = '完成【测试】，包含：中文、标点；符号！';
      const todo = todoService.add({ content });

      expect(todo).toEqual({
        id: 1,
        content,
        completed: false,
        createdAt: expect.any(Date),
        deadline: undefined
      });

      // 验证存储的内容是否正确
      const todos = todoService.list();
      expect(todos).toHaveLength(1);
      expect(todos[0].content).toBe(content);
    });
  });

  describe('complete', () => {
    it('应该成功将待办事项标记为完成', () => {
      // Arrange
      const content = '完成用户故事编写';
      const todo = todoService.add({ content });
      const beforeComplete = new Date();
      
      // Act
      const completedTodo = todoService.complete(todo.id);
      const afterComplete = new Date();
      
      // Assert
      expect(completedTodo.id).toBe(todo.id);
      expect(completedTodo.content).toBe(content);
      expect(completedTodo.completed).toBe(true);
      expect(completedTodo.completedAt).toBeInstanceOf(Date);
      expect(completedTodo.completedAt!.getTime()).toBeGreaterThanOrEqual(beforeComplete.getTime());
      expect(completedTodo.completedAt!.getTime()).toBeLessThanOrEqual(afterComplete.getTime());
      
      // 验证持久化
      const todos = todoService.list();
      const savedTodo = todos.find(t => t.id === todo.id);
      expect(savedTodo).toEqual(completedTodo);
    });

    it('当待办事项不存在时应该抛出错误', () => {
      // Arrange
      const nonExistentId = 999;
      
      // Act & Assert
      expect(() => todoService.complete(nonExistentId)).toThrow('待办事项不存在');
      
      // 验证数据未被修改
      const todos = todoService.list();
      expect(todos).toHaveLength(0);
    });

    it('当待办事项已完成时应该抛出错误', () => {
      // Arrange
      const content = '完成用户故事编写';
      const todo = todoService.add({ content });
      todoService.complete(todo.id);
      
      // Act & Assert
      expect(() => todoService.complete(todo.id)).toThrow('待办事项已完成');
      
      // 验证数据未被修改
      const todos = todoService.list();
      expect(todos).toHaveLength(1);
      expect(todos[0].completed).toBe(true);
      expect(todos[0].completedAt).toBeInstanceOf(Date);
    });

    it('当未提供待办事项ID时应该抛出错误', () => {
      // Act & Assert
      expect(() => todoService.complete(undefined as any)).toThrow('请提供待办事项ID');
      
      // 验证数据未被修改
      const todos = todoService.list();
      expect(todos).toHaveLength(0);
    });

    it('当提供非法ID格式时应该抛出错误', () => {
      // Arrange
      const content = '完成用户故事编写';
      todoService.add({ content });
      
      // Act & Assert
      expect(() => todoService.complete(0)).toThrow('待办事项ID必须为正整数');
      expect(() => todoService.complete(-1)).toThrow('待办事项ID必须为正整数');
      expect(() => todoService.complete(1.5)).toThrow('待办事项ID必须为正整数');
      expect(() => todoService.complete(NaN)).toThrow('待办事项ID必须为正整数');
      
      // 验证数据未被修改
      const todos = todoService.list();
      expect(todos).toHaveLength(1);
      expect(todos[0].completed).toBe(false);
      expect(todos[0].completedAt).toBeUndefined();
    });
  });

  describe('list', () => {
    it('应该返回所有待办事项', () => {
      const content = '完成用户故事编写';
      todoService.add({ content });

      const todos = todoService.list({});
      
      expect(todos).toHaveLength(1);
      expect(todos[0]).toEqual({
        id: 1,
        content,
        completed: false,
        createdAt: expect.any(Date),
        deadline: undefined
      });
    });

    describe('排序功能', () => {
      let todos: Todo[];
      
      beforeEach(async () => {
        // 准备测试数据
        todos = [
          todoService.add({ content: '完成用户故事编写', deadline: new Date('2025-12-31') }),
          todoService.add({ content: '实现功能代码', deadline: new Date('2025-06-30') }),
          todoService.add({ content: '编写测试用例' }), // 无截止日期
          todoService.add({ content: '完成代码审查', deadline: new Date('2025-09-30') }),
          todoService.add({ content: '部署到测试环境', deadline: new Date('2025-03-31') })
        ];
        
        // 将第四个待办事项标记为完成
        todoService.complete(todos[3].id);
      });

      it('按截止日期升序排序待办事项（未完成在前，已完成在后）', () => {
        const sortedTodos = todoService.list({ sortBy: 'deadline', order: 'asc' });

        // 验证排序结果
        expect(sortedTodos.map(t => t.content)).toEqual([
          '部署到测试环境',    // 最早截止日期（未完成）
          '实现功能代码',      // 第二早截止日期（未完成）
          '完成用户故事编写',  // 最晚截止日期（未完成）
          '编写测试用例',      // 无截止日期（未完成）
          '完成代码审查'       // 已完成的待办事项
        ]);
      });

      it('按截止日期降序排序待办事项（未完成在前，已完成在后）', () => {
        const sortedTodos = todoService.list({ sortBy: 'deadline', order: 'desc' });

        // 验证排序结果
        expect(sortedTodos.map(t => t.content)).toEqual([
          '完成用户故事编写',  // 最晚截止日期（未完成）
          '实现功能代码',      // 第二早截止日期（未完成）
          '部署到测试环境',    // 最早截止日期（未完成）
          '编写测试用例',      // 无截止日期（未完成）
          '完成代码审查'       // 已完成的待办事项
        ]);
      });

      it('不指定排序参数时应按创建时间排序', () => {
        const sortedTodos = todoService.list({});

        // 验证按创建时间排序（保持原始顺序）
        expect(sortedTodos.map(t => t.content)).toEqual([
          '完成用户故事编写',
          '实现功能代码',
          '编写测试用例',
          '完成代码审查',
          '部署到测试环境'
        ]);
      });

      it('相同截止日期的待办事项应按创建时间排序', () => {
        // 添加两个具有相同截止日期的待办事项
        const sameDateTodos = [
          todoService.add({ content: '任务A', deadline: new Date('2025-06-30') }),
          todoService.add({ content: '任务B', deadline: new Date('2025-06-30') })
        ];

        const sortedTodos = todoService.list({ sortBy: 'deadline', order: 'asc' });
        
        // 验证相同截止日期的待办事项按创建时间排序
        const sameDateContents = sortedTodos
          .filter(t => t.deadline?.toISOString().startsWith('2025-06-30'))
          .map(t => t.content);
        
        expect(sameDateContents).toEqual(['实现功能代码', '任务A', '任务B']);
      });

      it('已完成的待办事项应始终显示在未完成事项之后', () => {
        // 将一个有截止日期的待办事项标记为完成
        todoService.complete(todos[1].id); // 完成"实现功能代码"

        const sortedTodos = todoService.list({ sortBy: 'deadline', order: 'asc' });

        // 验证已完成的待办事项在最后
        const completedTodos = sortedTodos.filter(t => t.completed);
        const uncompletedTodos = sortedTodos.filter(t => !t.completed);

        expect(completedTodos.length).toBe(2);
        expect(uncompletedTodos.length).toBe(3);
        expect(sortedTodos.slice(-2).every(t => t.completed)).toBe(true);
      });

      it('无截止日期的待办事项应显示在有截止日期的未完成事项之后', () => {
        const sortedTodos = todoService.list({ sortBy: 'deadline', order: 'asc' });

        // 找到无截止日期的未完成待办事项的位置
        const noDeadlineTodoIndex = sortedTodos.findIndex(t => 
          !t.completed && !t.deadline && t.content === '编写测试用例'
        );

        // 找到最后一个有截止日期的未完成待办事项的位置
        const lastDeadlineTodoIndex = sortedTodos.findIndex(t => 
          !t.completed && t.deadline && t.content === '完成用户故事编写'
        );

        expect(noDeadlineTodoIndex).toBeGreaterThan(lastDeadlineTodoIndex);
      });
    });
  });

  describe('delete', () => {
    it('应该成功删除待办事项', () => {
      // Arrange
      const content = '完成用户故事编写';
      const todo = todoService.add({ content });
      
      // Act
      const deletedTodo = todoService.delete(todo.id);
      
      // Assert
      expect(deletedTodo.id).toBe(todo.id);
      expect(deletedTodo.content).toBe(content);
      
      // 验证待办事项已从列表中删除
      const todos = todoService.list();
      expect(todos).toHaveLength(0);
    });

    it('当待办事项不存在时应该抛出错误', () => {
      // Arrange
      const nonExistentId = 999;
      
      // Act & Assert
      expect(() => todoService.delete(nonExistentId)).toThrow('待办事项不存在');
      
      // 验证数据未被修改
      const todos = todoService.list();
      expect(todos).toHaveLength(0);
    });

    it('当未提供待办事项ID时应该抛出错误', () => {
      // Act & Assert
      expect(() => todoService.delete(undefined as any)).toThrow('请提供待办事项ID');
      
      // 验证数据未被修改
      const todos = todoService.list();
      expect(todos).toHaveLength(0);
    });

    it('当提供非法ID格式时应该抛出错误', () => {
      // Arrange
      const content = '完成用户故事编写';
      todoService.add({ content });
      
      // Act & Assert
      expect(() => todoService.delete(0)).toThrow('待办事项ID必须为正整数');
      expect(() => todoService.delete(-1)).toThrow('待办事项ID必须为正整数');
      expect(() => todoService.delete(1.5)).toThrow('待办事项ID必须为正整数');
      expect(() => todoService.delete(NaN)).toThrow('待办事项ID必须为正整数');
      
      // 验证数据未被修改
      const todos = todoService.list();
      expect(todos).toHaveLength(1);
    });

    it('应该能删除已完成的待办事项', () => {
      // Arrange
      const content = '完成用户故事编写';
      const todo = todoService.add({ content });
      todoService.complete(todo.id);
      
      // Act
      const deletedTodo = todoService.delete(todo.id);
      
      // Assert
      expect(deletedTodo.id).toBe(todo.id);
      expect(deletedTodo.content).toBe(content);
      expect(deletedTodo.completed).toBe(true);
      expect(deletedTodo.completedAt).toBeInstanceOf(Date);
      
      // 验证待办事项已从列表中删除
      const todos = todoService.list();
      expect(todos).toHaveLength(0);
    });
  });

  describe('reset', () => {
    it('应该成功将已完成的待办事项重置为未完成', () => {
      // Arrange
      const content = '完成用户故事编写';
      const todo = todoService.add({ content });
      const completedTodo = todoService.complete(todo.id);
      const completedAt = completedTodo.completedAt;
      
      // Act
      const resetTodo = todoService.reset(todo.id);
      
      // Assert
      expect(resetTodo.id).toBe(todo.id);
      expect(resetTodo.content).toBe(content);
      expect(resetTodo.completed).toBe(false);
      expect(resetTodo.completedAt).toBeUndefined();
      expect(resetTodo.createdAt).toEqual(todo.createdAt);
      
      // 验证持久化
      const todos = todoService.list();
      const savedTodo = todos.find(t => t.id === todo.id);
      expect(savedTodo).toEqual(resetTodo);
    });

    it('当待办事项不存在时应该抛出错误', () => {
      // Arrange
      const nonExistentId = 999;
      
      // Act & Assert
      expect(() => todoService.reset(nonExistentId)).toThrow('待办事项不存在');
      
      // 验证数据未被修改
      const todos = todoService.list();
      expect(todos).toHaveLength(0);
    });

    it('当待办事项未完成时应该抛出错误', () => {
      // Arrange
      const content = '完成用户故事编写';
      const todo = todoService.add({ content });
      
      // Act & Assert
      expect(() => todoService.reset(todo.id)).toThrow('待办事项未完成');
      
      // 验证数据未被修改
      const todos = todoService.list();
      expect(todos).toHaveLength(1);
      expect(todos[0].completed).toBe(false);
      expect(todos[0].completedAt).toBeUndefined();
    });

    it('当未提供待办事项ID时应该抛出错误', () => {
      // Act & Assert
      expect(() => todoService.reset(undefined as any)).toThrow('请提供待办事项ID');
      
      // 验证数据未被修改
      const todos = todoService.list();
      expect(todos).toHaveLength(0);
    });

    it('当提供非法ID格式时应该抛出错误', () => {
      // Arrange
      const content = '完成用户故事编写';
      const todo = todoService.add({ content });
      todoService.complete(todo.id);
      
      // Act & Assert
      expect(() => todoService.reset(0)).toThrow('待办事项ID必须为正整数');
      expect(() => todoService.reset(-1)).toThrow('待办事项ID必须为正整数');
      expect(() => todoService.reset(1.5)).toThrow('待办事项ID必须为正整数');
      expect(() => todoService.reset(NaN)).toThrow('待办事项ID必须为正整数');
      
      // 验证数据未被修改
      const todos = todoService.list();
      expect(todos).toHaveLength(1);
      expect(todos[0].completed).toBe(true);
      expect(todos[0].completedAt).toBeInstanceOf(Date);
    });
  });

  describe('completeBatch', () => {
    it('应该成功批量完成多个待办事项', () => {
      // Arrange
      const todos = [
        todoService.add({ content: '完成用户故事编写' }),
        todoService.add({ content: '实现功能代码' }),
        todoService.add({ content: '编写测试用例' })
      ];
      const beforeComplete = new Date();
      
      // Act
      const completedTodos = todoService.completeBatch(todos.map(t => t.id));
      const afterComplete = new Date();
      
      // Assert
      expect(completedTodos).toHaveLength(3);
      completedTodos.forEach((todo, index) => {
        expect(todo.id).toBe(todos[index].id);
        expect(todo.content).toBe(todos[index].content);
        expect(todo.completed).toBe(true);
        expect(todo.completedAt).toBeInstanceOf(Date);
        expect(todo.completedAt!.getTime()).toBeGreaterThanOrEqual(beforeComplete.getTime());
        expect(todo.completedAt!.getTime()).toBeLessThanOrEqual(afterComplete.getTime());
      });
      
      // 验证持久化
      const savedTodos = todoService.list();
      expect(savedTodos).toHaveLength(3);
      savedTodos.forEach(todo => {
        expect(todo.completed).toBe(true);
        expect(todo.completedAt).toBeInstanceOf(Date);
      });
    });

    it('当包含无效ID时应该忽略无效ID并完成有效待办事项', () => {
      // Arrange
      const todos = [
        todoService.add({ content: '完成用户故事编写' }),
        todoService.add({ content: '实现功能代码' })
      ];
      const invalidId = 999;
      
      // Act
      const completedTodos = todoService.completeBatch([...todos.map(t => t.id), invalidId]);
      
      // Assert
      expect(completedTodos).toHaveLength(2);
      completedTodos.forEach((todo, index) => {
        expect(todo.id).toBe(todos[index].id);
        expect(todo.content).toBe(todos[index].content);
        expect(todo.completed).toBe(true);
        expect(todo.completedAt).toBeInstanceOf(Date);
      });
    });

    it('当所有ID都无效时应该抛出错误', () => {
      // Arrange
      const invalidIds = [999, 1000];
      
      // Act & Assert
      expect(() => todoService.completeBatch(invalidIds))
        .toThrow('ID为 [999, 1000] 的待办事项不存在或已完成');
    });

    it('当未提供ID时应该抛出错误', () => {
      // Act & Assert
      expect(() => todoService.completeBatch([])).toThrow('请提供待办事项ID');
      expect(() => todoService.completeBatch(undefined as any)).toThrow('请提供待办事项ID');
    });

    it('当提供非法ID格式时应该抛出错误', () => {
      // Arrange
      todoService.add({ content: '完成用户故事编写' });
      
      // Act & Assert
      expect(() => todoService.completeBatch([0])).toThrow('待办事项ID必须为正整数');
      expect(() => todoService.completeBatch([-1])).toThrow('待办事项ID必须为正整数');
      expect(() => todoService.completeBatch([1.5])).toThrow('待办事项ID必须为正整数');
      expect(() => todoService.completeBatch([NaN])).toThrow('待办事项ID必须为正整数');
    });

    it('当待办事项已完成时应该忽略并继续处理其他待办事项', () => {
      // Arrange
      const todo1 = todoService.add({ content: '完成用户故事编写' });
      const todo2 = todoService.add({ content: '实现功能代码' });
      todoService.complete(todo1.id);
      
      // Act
      const completedTodos = todoService.completeBatch([todo1.id, todo2.id]);
      
      // Assert
      expect(completedTodos).toHaveLength(1);
      expect(completedTodos[0].id).toBe(todo2.id);
      expect(completedTodos[0].completed).toBe(true);
      expect(completedTodos[0].completedAt).toBeInstanceOf(Date);
    });
  });
}); 