# 添加带截止日期的待办事项

## 作为（As a）
命令行用户

## 我想要（I want）
在添加待办事项时可以设置截止日期

## 以便于（So that）
更好地管理任务优先级和时间安排

## 验收标准（Acceptance Criteria）
- [ ] 支持在添加待办事项时指定截止日期
- [ ] 截止日期格式为 YYYY-MM-DD
- [ ] 截止日期参数为可选项
- [ ] 截止日期必须是未来的日期
- [ ] 显示待办事项时包含截止日期信息
- [ ] 提供完整的参数验证和错误提示

## 补充信息
- 业务规则：
  * 截止日期必须是有效的日期格式
  * 截止日期必须是未来的日期
  * 不指定截止日期时，deadline 字段为 undefined
  * 日期格式统一使用 YYYY-MM-DD
  * 显示截止日期时需要标注剩余天数

- 技术要求：
  * 命令格式：`node dist/cli.js add <content> --deadline YYYY-MM-DD`
  * 参数验证：确保日期格式正确
  * 错误处理：提供清晰的错误提示
  * 数据存储：在 Todo 接口中添加 deadline 字段
  * 日期处理：使用 UTC+8 时区

## 关联文件
- Feature：/features/todo/add-todo-with-deadline.feature
- 实现文件：src/cli.ts, src/services/todoService.ts 