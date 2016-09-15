'use strict'

const express = require('express')
const router = express.Router()
const apiHandlers = require('../handlers/api')
const rateLimiter = require('../libs/ratelimiter')

router.get('/users', apiHandlers.getUsers)
router.get('/setKey', rateLimiter.setLimit(2,'10 minutes'), (req, res, next) => res.send('ANJAY'))
router.get('/getKey', rateLimiter.getLimit, (req, res, next) => res.send(req.levelup))
module.exports = router