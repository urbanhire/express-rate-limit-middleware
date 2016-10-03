# express-rate-limit-middleware
<p>
  <a href="#installation">Installation</a> |
  <a href="#usage">Usage</a> |
  <a href="#options">Options</a> |  
  <a href="#licenses">License</a>
  <br><br>
  <blockquote>
  Limiting access to endpoint using express middleware backed by LevelDB like and redis storage 
  </blockquote>
</p>

Installation
------------
* From published module in npm (not latest)
`npm install --save express-rate-limit-middleware`
* Using github master branch
`npm install --save https://github.com/urbanhire/express-rate-limit-middleware.git#master`


Usage
------------
* By default, you only need to pass 2 parameters, limit and reset
* You can use this middleware as application level (every endpoint will be limited) or router level 
* Application Level Middleware
```js
const express = require('express')
const app = express()
const rateLimiter = require('express-rate-limit-middleware').rateLimit

// limit 1000 request per hour to all url
app.use(rateLimiter({
  limit: 1000, 
  reset: '1 hour' // more convenient to set reset
}))
```

* Router Level Middleware
```js
const express = require('express')
const router = express.Router()
const rateLimiter = require('express-rate-limit-middleware').rateLimit

// limit 1000 request per hour to all url
router.get('/api', 
	rateLimiter({
  		limit: 1000, 
  		reset: '1 hour' // more convenient to set reset
	}),
	(req, res, next) => {
		res.send('OK')
	}
)
```

Options
--------
* limit : How many request per interval
* reset : Interval
* storageEngine : Storage engine you want to use, we provide 2 storage engine, levelDB and redis. LevelDB storage will be used if you don't pass this parameter
* Example of using redis
```js
const express = require('express')
const app = express()
const redisStorage = require('express-rate-limit-middleware').redisRateLimit
const redisClient = require('redis-pool-connection')({
  host: '127.0.0.1',
  port: 6379,
  options: {
    db: 1
  }
})
// here i'm using redis-pool-connection module but you can use any redis client
const rateLimiter = require('express-rate-limit-middleware').rateLimit
app.set('port', process.env.PORT || 3000)
app.set('env', process.env.NODE_ENV || 'development')
// Middlewares setup
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(rateLimiter({
  limit: 200, 
  reset: '1 minute',
  storageEngine: redisStorage(redisClient)
}))
```
* Key generator, by default we're using req.ip and req.originalUrl provided by express, you can define your own key generator
* Example
```js
const express = require('express')
const app = express()
const rateLimiter = require('express-rate-limit-middleware').rateLimit

app.set('port', process.env.PORT || 3000)
app.set('env', process.env.NODE_ENV || 'development')
// Middlewares setup
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(rateLimiter({
  limit: 200, 
  reset: '1 minute',
  keyGenerator: (req, res) => {
    return req.ip + 'anjay'
  }
}))
```

Todo
------------
* Logging

License
----

MIT © [Adhitya Ramadhanus]
