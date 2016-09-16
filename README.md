# express-rate-limit-middleware
<p>
  <a href="#installation">Installation</a> |
  <a href="#usage">Usage</a> |
  <a href="#licenses">License</a>
  <br><br>
  <blockquote>
  Limiting access to some endpoint using express middleware backed by levelup and memdown 
  </blockquote>
</p>

Installation
------------
`npm install --save express-rate-limit-middleware`

Usage
------------
* Application Level Middleware
```js
const express = require('express')
const app = express()

// limit 1000 request per hour to all url
app.use(rateLimiter.setLimit({
  limit: 1000, 
  reset: '1 hour' // more convenient to set reset
}))

* Router Level Middleware
```js
const express = require('express')
const router = express.Router()

// limit 1000 request per hour to all url
router.get('/api', 
	rateLimiter.setLimit({
  		limit: 1000, 
  		reset: '1 hour' // more convenient to set reset
	}),
	(req, res, next) => {
		res.send('OK')
	}
)
```

License
----

MIT © [Adhitya Ramadhanus]
