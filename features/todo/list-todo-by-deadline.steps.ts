import { Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { commandOutput } from '../support/common.steps';

Then('我应该看到按创建时间排序的列表', async function () {
  const output = commandOutput;
  
  // 验证输出包含所有待办事项
  expect(output).to.include('完成用户故事编写');
  expect(output).to.include('实现功能代码');
  expect(output).to.include('编写测试用例');
  expect(output).to.include('完成代码审查');
  expect(output).to.include('部署到测试环境');
  
  // 验证顺序（按创建时间排序）
  const lines = output.split('\n');
  const contentLines = lines.filter(line => line.includes('内容:'));
  const contents = contentLines.map(line => {
    const match = line.match(/内容: '(.+)'/);
    return match ? match[1] : '';
  });
  
  expect(contents).to.deep.equal([
    '完成用户故事编写',
    '实现功能代码',
    '编写测试用例',
    '完成代码审查',
    '部署到测试环境'
  ]);
}); 