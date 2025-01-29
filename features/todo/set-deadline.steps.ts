import { Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { commandOutput } from '../support/common.steps';

Then('我应该看到如下输出：', function (expectedOutput) {
  expect(commandOutput.trim()).to.equal(expectedOutput.trim());
});
