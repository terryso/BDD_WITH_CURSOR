# 完成所有待办事项

## 作为（As a）
命令行用户

## 我想要（I want）
一次性将所有未完成的待办事项标记为已完成

## 以便于（So that）
快速清理待办事项列表，标记一个阶段性任务的完成

## 验收标准（Acceptance Criteria）
- [ ] 支持使用 `complete-all` 命令完成所有未完成的待办事项
- [ ] 所有未完成的待办事项都会被标记为已完成
- [ ] 已完成的待办事项保持不变
- [ ] 完成时显示已完成的待办事项数量
- [ ] 当没有未完成的待办事项时显示提示信息

## 补充信息
- 业务规则：
  * 只处理未完成的待办事项
  * 所有被处理的待办事项的完成时间应该相同
  * 操作不可撤销
  * 需要显示详细的操作结果

- 技术要求：
  * 命令格式：`node dist/cli.js complete-all`
  * 性能要求：批量处理应在 100ms 内完成
  * 代码实现：在 TodoService 中添加 completeAll 方法
  * 错误处理：提供清晰的错误和成功提示

## 关联文件
- Feature：/features/todo/complete-all.feature
- 实现文件：src/cli.ts, src/services/todoService.ts 