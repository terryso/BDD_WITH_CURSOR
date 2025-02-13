# language: zh-CN
# encoding: UTF-8
# 关联故事: /stories/todo/list-todo.story.md

功能: 展示待办事项列表
  作为命令行用户
  我想要通过命令行查看所有待办事项的列表
  以便于我能够了解所有待办事项的状态和进展

  场景: 显示空列表
    当我执行命令 "node dist/cli.js list"
    那么我应该看到如下反馈信息:
      """
      暂无待办事项
      """

  场景: 显示单个未完成的待办事项
    假设已经存在一条待办事项 "完成用户故事编写"
    当我执行命令 "node dist/cli.js list"
    那么我应该看到如下反馈信息:
      """
      待办事项列表:

      编号: 1
      内容: '完成用户故事编写'
      创建时间: {current_time}
      状态: 未完成
      """

  场景: 显示单个已完成的待办事项
    假设已经存在一条待办事项 "完成用户故事编写"
    当我执行命令 "node dist/cli.js complete 1"
    当我执行命令 "node dist/cli.js list"
    那么我应该看到如下反馈信息:
      """
      待办事项列表:

      编号: 1
      内容: '完成用户故事编写'
      创建时间: {current_time}
      完成时间: {current_time}
      状态: 已完成
      """

  场景: 显示多个待办事项
    假设已经存在一条待办事项 "完成用户故事编写"
    而且已经存在一条待办事项 "实现待办事项列表功能"
    当我执行命令 "node dist/cli.js complete 1"
    当我执行命令 "node dist/cli.js list"
    那么我应该看到如下反馈信息:
      """
      待办事项列表:

      编号: 1
      内容: '完成用户故事编写'
      创建时间: {current_time}
      完成时间: {current_time}
      状态: 已完成

      编号: 2
      内容: '实现待办事项列表功能'
      创建时间: {current_time}
      状态: 未完成
      """ 
