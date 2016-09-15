'use strict'
const fs = require('fs')
const path = require('path')

module.exports.loadRoute = (dirName, app) => {
  fs.readdir(dirName, (err, listFiles) => {
    if (err) console.log(err)
    var filteredList = listFiles.filter((file) => {
      return (file.indexOf('.js') > 0)
    })
    filteredList.forEach((module) => {
      var cleanModule = module.replace('.js', '')
      app.use('/' + cleanModule, require(path.join(dirName, cleanModule)))
      console.log(cleanModule + ' route loaded')
    })
    console.log('Finish Load')
  })
}
