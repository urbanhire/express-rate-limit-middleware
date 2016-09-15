'use strict'

const express = require('express')
const app = express()

const setupApp = require('./setup/express')

setupApp(app, express)

app.listen(app.get('port'), () => {
	console.log('\n express rate limit server up, port : ' + app.get('port') + ' environment ' + app.get('env'))
})

module.exports = app