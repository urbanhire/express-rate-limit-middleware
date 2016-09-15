'use strict'

const express = require('express')
const router = express.Router()
const apiHandlers = require('../handlers/api')
const rateLimiter = require('../libs/ratelimiter')

router.get('/users', rateLimiter.setLimit(2,'1 minute'), apiHandlers.getUsers)
module.exports = router