# language: zh-CN
功能: 批量完成待办事项
  作为命令行用户
  我想要能够一次性将多个待办事项标记为已完成
  以便于提高工作效率，避免重复执行完成命令

  场景: 成功批量完成多个待办事项
    假设已经存在以下待办事项：
      | 内容                 |
      | 完成用户故事编写     |
      | 实现功能代码         |
      | 编写测试用例         |
    当我执行命令 "node dist/cli.js complete-batch 1 2 3"
    那么我应该看到如下反馈信息：
      """
      已批量完成待办事项：
      
      编号: 1
      内容: '完成用户故事编写'
      完成时间: {current_time}
      状态: 已完成
      
      编号: 2
      内容: '实现功能代码'
      完成时间: {current_time}
      状态: 已完成
      
      编号: 3
      内容: '编写测试用例'
      完成时间: {current_time}
      状态: 已完成
      """

  场景: 批量完成时包含无效的待办事项ID
    假设已经存在以下待办事项：
      | 内容                 |
      | 完成用户故事编写     |
      | 实现功能代码         |
    当我执行命令 "node dist/cli.js complete-batch 1 2 999"
    那么我应该看到如下反馈信息：
      """
      已批量完成待办事项：
      
      编号: 1
      内容: '完成用户故事编写'
      完成时间: {current_time}
      状态: 已完成
      
      编号: 2
      内容: '实现功能代码'
      完成时间: {current_time}
      状态: 已完成
      
      注意：ID为 [999] 的待办事项不存在，已忽略
      """ 