# language: zh-CN
# encoding: UTF-8
# 关联故事: /stories/todo/delete-todo.story.md

功能: 删除待办事项
  作为命令行用户
  我想要通过命令行删除指定的待办事项
  以便于我能够移除不再需要追踪的任务

  背景:
    假设已经存在一条待办事项 "完成用户故事编写"

  场景: 成功删除待办事项
    当我执行命令 "node dist/cli.js delete 1"
    那么我应该看到如下反馈信息:
      """
      已删除待办事项:
      编号: 1
      内容: '完成用户故事编写'
      """
    而且待办事项应该从列表中删除

  场景: 尝试删除不存在的待办事项
    当我执行命令 "node dist/cli.js delete 999"
    那么我应该看到错误信息 "待办事项不存在"

  场景: 不提供待办事项ID
    当我执行命令 "node dist/cli.js delete"
    那么我应该看到错误信息 "请提供待办事项ID"

  场景: 使用非法ID格式
    当我执行命令 "node dist/cli.js delete abc"
    那么我应该看到错误信息 "待办事项ID必须为正整数"
    当我执行命令 "node dist/cli.js delete -1"
    那么我应该看到错误信息 "待办事项ID必须为正整数"
    当我执行命令 "node dist/cli.js delete 0"
    那么我应该看到错误信息 "待办事项ID必须为正整数"

  场景: 删除已完成的待办事项
    当我执行命令 "node dist/cli.js complete 1"
    那么我应该看到如下反馈信息:
      """
      已将待办事项标记为完成:
      编号: 1
      内容: '完成用户故事编写'
      完成时间: {current_time}
      状态: 已完成
      """
    当我执行命令 "node dist/cli.js delete 1"
    那么我应该看到如下反馈信息:
      """
      已删除待办事项:
      编号: 1
      内容: '完成用户故事编写'
      """
    而且待办事项应该从列表中删除 
