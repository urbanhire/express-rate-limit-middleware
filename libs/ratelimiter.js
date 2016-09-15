'use strict'

const levelup = require('levelup')
const memdown = require('memdown')
const db = levelup(memdown)
const moment = require('moment')

module.exports.setLimit = (limit, reset) => {
  var resetTime = reset.split(' ')
  function setKey (requestKey, next, objectKey) {
    var limitObj = objectKey || {
      limit: limit,
      reset: moment().add(resetTime[0], resetTime[1]),
      remaining: limit
    }
    console.log('add key', JSON.stringify(limitObj))
    db.put(requestKey, JSON.stringify(limitObj), (err) => {
      if (err) console.log(err)
      next()
    })
  }
  return (req, res, next) => {
    var ip = req.ip
    var url = req.originalUrl
    console.log('Requestor', ip, req.originalUrl)
    var requestKey = `${ip}:ratelimit:${url}`
    db.get(requestKey, (err, value) => {
      if (err) {
        setKey(requestKey, next)
      }
      else {
        var limitObj = JSON.parse(value)
        console.log('comparing ', moment(limitObj.reset).format(), moment().format())
        if (moment(limitObj.reset) < moment()){
          setKey(requestKey, next)
        }
        else{
          if (limitObj.remaining === 0) {
            res.status(429).send('Too many request')
          } else {
            limitObj.remaining--
            setKey(requestKey, next, limitObj)
          }
        }
      }
    })
  }
}
