# language: zh-CN
# encoding: UTF-8
# 关联故事: /stories/todo/add-todo.story.md

功能: 添加待办事项
  作为命令行用户
  我想要通过命令行添加一条新的待办事项
  以便于我能够记录需要完成的任务

  场景: 成功添加一条待办事项
    当我执行命令 "node dist/cli.js add '完成用户故事编写'"
    那么我应该看到如下反馈信息:
      """
      已添加新的待办事项:
      编号: 1
      内容: '完成用户故事编写'
      创建时间: {current_time}
      状态: 未完成
      """
    而且待办事项列表中应该包含这条新添加的记录

  场景: 尝试添加空内容的待办事项
    当我执行命令 "node dist/cli.js add ''"
    那么我应该看到错误信息 "待办事项内容不能为空"
    而且待办事项列表应该为空

  场景: 尝试添加超长内容的待办事项
    当我执行命令 "node dist/cli.js add '这是一段超过100字符的内容这是一段超过100字符的内容这是一段超过100字符的内容这是一段超过100字符的内容这是一段超过100字符的内容这是一段超过100字符的内容这是一段超过100字符的内容这是一段超过100字符的内容'"
    那么我应该看到错误信息 "待办事项内容长度不能超过100字符"
    而且待办事项列表应该为空

  场景: 添加包含特殊字符的待办事项
    当我执行命令 "node dist/cli.js add '完成测试!@#$%^&*()'"
    那么我应该看到如下反馈信息:
      """
      已添加新的待办事项:
      编号: 1
      内容: '完成测试!@#$%^&*()'
      创建时间: {current_time}
      状态: 未完成
      """
    而且待办事项列表中应该包含这条新添加的记录

  场景: 添加包含中文标点符号的待办事项
    当我执行命令 "node dist/cli.js add '完成【测试】，包含：中文、标点；符号！'"
    那么我应该看到如下反馈信息:
      """
      已添加新的待办事项:
      编号: 1
      内容: '完成【测试】，包含：中文、标点；符号！'
      创建时间: {current_time}
      状态: 未完成
      """
    而且待办事项列表中应该包含这条新添加的记录

  场景: 尝试添加重复的待办事项
    当我执行命令 "node dist/cli.js add '完成用户故事编写'"
    那么我应该看到如下反馈信息:
      """
      已添加新的待办事项:
      编号: 1
      内容: '完成用户故事编写'
      创建时间: {current_time}
      状态: 未完成
      """
    当我执行命令 "node dist/cli.js add '完成用户故事编写'"
    那么我应该看到错误信息 "待办事项已存在"
    而且待办事项列表中应该只包含一条记录
