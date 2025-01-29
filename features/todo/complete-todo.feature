# language: zh-CN
# encoding: UTF-8
# 关联故事: /stories/todo/complete-todo.story.md

功能: 标记待办事项为完成
  作为命令行用户
  我想要通过命令行将指定的待办事项标记为已完成
  以便于我能够追踪已经完成的任务

  背景:
    假设已经存在一条待办事项 "完成用户故事编写"

  场景: 成功标记待办事项为完成
    当我执行命令 "node dist/cli.js complete 1"
    那么我应该看到如下反馈信息:
      """
      已将待办事项标记为完成:
      编号: 1
      内容: '完成用户故事编写'
      完成时间: {current_time}
      状态: 已完成
      """
    而且待办事项的状态应该更新为已完成

  场景: 尝试标记不存在的待办事项为完成
    当我执行命令 "node dist/cli.js complete 999"
    那么我应该看到错误信息 "待办事项不存在"

  场景: 尝试重复标记已完成的待办事项
    当我执行命令 "node dist/cli.js complete 1"
    那么我应该看到如下反馈信息:
      """
      已将待办事项标记为完成:
      编号: 1
      内容: '完成用户故事编写'
      完成时间: {current_time}
      状态: 已完成
      """
    当我执行命令 "node dist/cli.js complete 1"
    那么我应该看到错误信息 "待办事项已完成"

  场景: 不提供待办事项ID
    当我执行命令 "node dist/cli.js complete"
    那么我应该看到错误信息 "请提供待办事项ID"

  场景: 使用非法ID格式
    当我执行命令 "node dist/cli.js complete abc"
    那么我应该看到错误信息 "待办事项ID必须为正整数"
    当我执行命令 "node dist/cli.js complete -1"
    那么我应该看到错误信息 "待办事项ID必须为正整数"
    当我执行命令 "node dist/cli.js complete 0"
    那么我应该看到错误信息 "待办事项ID必须为正整数" 