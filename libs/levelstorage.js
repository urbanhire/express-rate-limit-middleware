'use strict'

const levelup = require('levelup')
const memdown = require('memdown')
const db = levelup(memdown)

module.exports = () => {
  return {
    put: (opt, callback) => {
      db.put(opt.requestKey, JSON.stringify(opt.objectKey), callback)
    },
    get: (requestKey, callback) => {
      db.get(requestKey, callback)
    },
    del: (requestKey, callback) => {
      db.del(requestKey, callback)
    }
  }
}
