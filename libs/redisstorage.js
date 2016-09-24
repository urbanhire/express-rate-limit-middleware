'use strict'

module.exports = (redisClient) => {
  return {
    put: (opt, callback) => {
      redisClient.set(opt.requestKey, JSON.stringify(opt.objectKey), callback)
    },
    get: (requestKey, callback) => {
      redisClient.get(requestKey, callback)      
    },
    del: (requestKey, callback) => {
      redisClient.set(requestKey, callback)
    }
  }
}
