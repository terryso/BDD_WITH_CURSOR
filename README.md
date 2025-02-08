# Cursor + Cucumber BDD 开发教程

[English Version](./README.en.md)

本项目展示了如何使用 Cursor + Cucumber 框架进行 BDD（行为驱动开发）。通过结合 Cursor 的规则系统和 Cucumber 的 BDD 框架，我们可以实现一个规范化、自动化的开发流程。

🎥 [观看演示视频](https://youtu.be/teiqYP-yW4U?si=_X4T81lLYlVYwF4-)

## Composer 设置

在开始开发之前，请确保 Cursor 的 Composer 做如下设置：

1. 开启 Agent 模式：
   - 在 Composer 输入框右下角选择 "agent" 模式
   - 这将启用更强大的 AI 助手功能

2. 开启 YOLO 模式：
   - 在 Cursor 设置中勾选 "Enable YOLO Mode"
   - 这将允许 AI 助手直接执行某些安全的操作，提高开发效率

## 项目设置

1. 在 Cursor 中创建新项目后，首先设置项目规则：

```bash
mkdir -p .cursor/rules
```

2. 添加两个核心规则文件：

- `.cursor/rules/project-rules.mdc`：定义 TDD 和单元测试规范
- `.cursor/rules/story-rules.mdc`：定义用户故事和需求管理规范

## 开发流程

### 1. 创建用户故事（Story Creation）
在 Cursor 的 Composer 中输入：
```
我想增加[功能描述]，帮我生成用户故事
```
Cursor Agent 会根据 `story-rules.mdc` 模板在 `stories/` 目录下创建用户故事文件，包含：
- 完整的故事结构（As a/I want/So that）
- 初步的验收标准
- 补充信息和关联文件

等待用户确认故事内容和验收标准后再进行下一步。

### 2. 创建 Feature 文件（Feature Creation）
前置条件：用户故事已确认

在 Composer 中输入：
```
根据[用户故事路径]，创建 feature 文件和第一个场景
```
Cursor Agent 会：
- 在 features 目录下创建对应的 feature 文件
- 创建第一个基础场景
- 确保 feature 文件头部包含对应用户故事的引用

### 3. 场景步骤定义（Steps Definition）
在 Composer 中输入：
```
请为[场景名称]定义步骤
```
Cursor Agent 会：
- 创建对应的 `.steps.ts` 文件
- 根据 BDD 规范编写 Given-When-Then 步骤
- 确保步骤定义清晰且符合项目规范

### 4. BDD 测试实现（BDD Implementation）
在 Composer 中输入：
```
运行 BDD 测试并实现功能
```
Cursor Agent 会：
- 执行 `npm run test:bdd`
- 分析测试失败原因
- 实现必要的功能代码
- 循环执行直到 BDD 测试通过
- 进行必要的代码重构

### 5. 单元测试开发（Unit Testing）
前置条件：BDD 测试全部通过

在 Composer 中输入：
```
根据[场景路径]生成单元测试
```
Cursor Agent 会：
- 创建对应的 `.test.ts` 文件
- 编写符合 TDD 规范的单元测试
- 执行 `npm run test:unit`
- 完善功能实现直到单元测试通过
- 确保测试覆盖率满足要求

### 6. 场景完成确认（Scenario Completion）
确认清单：
- [ ] 用户故事验收标准已满足
- [ ] BDD 测试全部通过
- [ ] 单元测试全部通过
- [ ] 代码已完成必要重构
- [ ] 文档已更新

### 7. 下一个场景（Next Scenario）
重复步骤 2-6 直到所有场景完成

## 开发最佳实践

1. **遵循 TDD 流程**：
   - 先写测试（Red）
   - 实现功能（Green）
   - 重构优化（Refactor）

2. **BDD 场景开发**：
   - 一次只开发一个场景
   - 确保场景独立性
   - 使用清晰的业务语言

3. **代码提交**：
   - 小步提交
   - 清晰的提交信息
   - 确保测试通过

4. **文档维护**：
   - 及时更新用户故事状态
   - 保持文档和代码的一致性
   - 记录重要决策和变更

## 项目结构

```
.
├── .cursor/
│   └── rules/
│       ├── project-rules.mdc    # 项目规则
│       └── story-rules.mdc      # 故事规则
├── features/                    # BDD 测试目录
│   └── [模块]/
│       ├── [功能].feature      # 功能描述文件
│       └── [功能].steps.ts     # 步骤定义文件
├── stories/                     # 用户故事目录
│   └── [模块]/
│       └── [功能].story.md     # 用户故事文件
├── src/                         # 源代码目录
│   └── [模块]/
│       ├── [文件].ts           # 实现文件
│       └── [文件].test.ts      # 单元测试文件
├── package.json
└── README.md
```

## 示例

可以参考本项目中的待办事项（Todo）模块作为示例：

1. 用户故事：`stories/todo/add-todo.story.md`
2. 功能描述：`features/todo/add-todo.feature`
3. 步骤定义：`features/todo/add-todo.steps.ts`
4. 单元测试：`src/services/todoService.test.ts`
5. 实现代码：`src/services/todoService.ts`

## 常见问题

1. **如何处理复杂场景？**
   - 将复杂场景拆分为多个简单场景
   - 使用场景大纲（Scenario Outline）处理多个类似场景
   - 合理使用 Background 共享前置条件

2. **如何管理测试数据？**
   - 使用工厂函数创建测试数据
   - 在 Background 中准备公共数据
   - 使用 Examples 表格管理测试数据

3. **如何确保测试质量？**
   - 遵循 AAA（Arrange-Act-Assert）模式
   - 一个测试只验证一个行为
   - 保持测试代码的可读性和可维护性

## 注意事项

1. 确保所有测试都是独立的，不依赖于其他测试的执行结果
2. 定期检查测试覆盖率，确保核心功能都有测试覆盖
3. 保持文档和代码的同步更新
4. 遵循项目规则中定义的编码和测试标准 