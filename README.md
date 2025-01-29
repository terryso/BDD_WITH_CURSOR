# Cursor + Cucumber BDD 开发教程

[English Version](./README.en.md)

本项目展示了如何使用 Cursor + Cucumber 框架进行 BDD（行为驱动开发）。通过结合 Cursor 的规则系统和 Cucumber 的 BDD 框架，我们可以实现一个规范化、自动化的开发流程。

## 项目设置

1. 在 Cursor 中创建新项目后，首先设置项目规则：

```bash
mkdir -p .cursor/rules
```

2. 添加两个核心规则文件：

- `.cursor/rules/project-rules.mdc`：定义 TDD 和单元测试规范
- `.cursor/rules/story-rules.mdc`：定义用户故事和需求管理规范

## 开发流程

### 1. 创建用户故事（Story）

在 `stories/` 目录下创建用户故事文件，遵循 `story-rules.mdc` 的规范：

```bash
mkdir -p stories/[模块名]
touch stories/[模块名]/[功能名].story.md
```

用户故事模板：
```markdown
# [故事标题]

## 作为（As a）
[用户角色]

## 我想要（I want）
[期望实现的功能]

## 以便于（So that）
[实现的业务价值]

## 验收标准（Acceptance Criteria）
- [ ] [验收项1]
- [ ] [验收项2]

## 补充信息
- 业务规则：
  * [规则1]
  * [规则2]
- 技术要求：
  * [要求1]
  * [要求2]

## 关联文件
- Feature：[路径]
- 实现文件：[路径]
```

### 2. 创建 Feature 文件

在 `features/` 目录下创建对应的 feature 文件：

```bash
mkdir -p features/[模块名]
touch features/[模块名]/[功能名].feature
```

Feature 文件模板：
```gherkin
# language: zh-CN
功能: [功能名称]
  作为[角色]
  我想要[期望实现的功能]
  以便于[实现的业务价值]

  场景: [场景1描述]
    假设[前置条件]
    当[触发动作]
    那么[预期结果]

  场景: [场景2描述]
    假设[前置条件]
    当[触发动作]
    那么[预期结果]
```

### 3. 实现步骤定义

创建对应的步骤定义文件：

```bash
touch features/[模块名]/[功能名].steps.ts
```

步骤定义模板：
```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';

Given('前置条件描述', async function () {
  // 实现前置条件
});

When('触发动作描述', async function () {
  // 实现动作
});

Then('预期结果描述', async function () {
  // 验证结果
});
```

### 4. 编写单元测试

在 `src/` 目录下创建对应的测试文件：

```bash
touch src/[模块名]/[文件名].test.ts
```

测试文件模板：
```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('模块名称', () => {
  beforeEach(() => {
    // 准备测试环境
  });

  describe('功能名称', () => {
    it('应该实现预期行为', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### 5. 实现功能代码

在 `src/` 目录下创建实现文件：

```bash
touch src/[模块名]/[文件名].ts
```

### 6. 运行测试

```bash
# 运行单元测试
npm run test:unit

# 运行 BDD 测试
npm run test:bdd

# 运行所有测试
npm test
```

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