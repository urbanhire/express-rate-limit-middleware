'use strict'

const levelStorage = require('./libs/levelstorage')
const redisStorage = require('./libs/redisstorage')
const moment = require('moment')
const extend = require('extend')

function defaultKeyGenerator (req, res) {
  var ip = req.ip
  var url = req.originalUrl
  return `${ip}:ratelimit:${url}`
}

module.exports.redisRateLimit = redisStorage
module.exports.levelRateLimit = levelStorage

module.exports.rateLimit = (options) => {
  const storage = (options.storageEngine) ? options.storageEngine : levelStorage()
  const keyGenerator = (options.keyGenerator && typeof options.keyGenerator === 'function') ? options.keyGenerator : defaultKeyGenerator
  var reset = options.reset || '1 hour'
  var limit = options.limit || 1000
  var resetTime = reset.split(' ')
  return (req, res, next) => {

    function setKey (opt) {
      storage.put(opt, (err) => {
        if (err) console.log(err)
      })
    }

    function setHeaders (opt) {
      res.setHeader('X-RateLimit-Limit', opt.limit)
      res.setHeader('X-RateLimit-Remaining', opt.remaining)
      res.setHeader('X-RateLimit-Reset', opt.reset)
    }

    function addNewKey (requestKey) {
      var objectKey = {
        limit: limit,
        reset: moment().add(resetTime[0], resetTime[1]),
        remaining: limit-1
      }
      setKey({
        requestKey: requestKey,
        objectKey: objectKey
      })
      setHeaders(objectKey)
    }

    var requestKey = keyGenerator(req, res)
    console.log('requestor', requestKey)
    storage.get(requestKey, (err, value) => {
      console.log(err, value)
      if (err || !value) {
        addNewKey(requestKey)
        next()
      }
      else {
        var limitObj = JSON.parse(value)
        if (moment(limitObj.reset) < moment()){
          addNewKey(requestKey)
          next()
        } else if (limitObj.remaining === 0) {
          (options.limitCallback) 
            ? options.limitCallback(req, res, next, extend({}, limitObj, {ip: ip, url: url})) 
            : res.status(429).send('You shall not pass!')
        } else {
          var newLimit = extend({}, limitObj, {remaining: limitObj.remaining-1})
          setHeaders(newLimit)
          setKey({
            requestKey: requestKey,
            objectKey: newLimit
          })
          next()
        }
      }
    })
  }
}
