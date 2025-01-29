import { Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { commandOutput } from '../support/common.steps';

Then('我应该看到提示信息 {string}', async function (message: string) {
  expect(commandOutput.trim()).to.equal(message);
}); 