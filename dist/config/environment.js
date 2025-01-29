"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.Environment = void 0;
var Environment;
(function (Environment) {
    Environment["TEST"] = "test";
    Environment["STAGING"] = "staging";
    Environment["PRODUCTION"] = "production";
})(Environment || (exports.Environment = Environment = {}));
const getConfig = (env = Environment.TEST) => {
    switch (env) {
        case Environment.TEST:
            return {
                apiBaseUrl: 'mock://api',
                isTestMode: true
            };
        case Environment.STAGING:
            return {
                apiBaseUrl: 'https://staging.gmgn.ai',
                isTestMode: false
            };
        case Environment.PRODUCTION:
            return {
                apiBaseUrl: 'https://gmgn.ai',
                isTestMode: false
            };
    }
};
exports.getConfig = getConfig;
