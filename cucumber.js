module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['features/**/*.steps.ts'],
    format: ['progress-bar', 'html:cucumber-report.html'],
    formatOptions: { snippetInterface: 'async-await' }
  }
}; 