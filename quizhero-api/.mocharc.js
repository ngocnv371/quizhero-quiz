'use strict'

module.exports = {  
  exit: true,
  bail: true,
  slow: 1000,
  recursive: true,
  reporter: "mocha-multi-reporters",
  reporterOptions: ["configFile=test/config.json"]
}