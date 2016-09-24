'use strict'

const levelup = require('levelup')
const memdown = require('memdown')
const db = levelup(memdown)

const storageInterface = require('../interfaces/storage')

var levelStorage = function () {}

levelStorage.prototype = Object.create(storageInterface)
levelStorage.prototype.put = (opt, callback) => {
  db.put(opt.requestKey, JSON.stringify(opt.objectKey), callback)
}

levelStorage.prototype.get = (requestKey, callback) => {
  db.get(requestKey, callback)
}

levelStorage.prototype.del = (requestKey, callback) => {
  db.del(requestKey, callback)
}

module.exports = levelStorage
