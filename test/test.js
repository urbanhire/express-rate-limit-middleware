var describe = require('mocha').describe
var it = require('mocha').it
var expect = require('chai').expect
var assert = require('chai').assert
var should = require('chai').should()
var httpMocks = require('node-mocks-http')

var middleware = require('../ratelimit').rateLimit

describe('RateLimit Middleware Test', () => {
  describe('Middleware creation', () => {
    var mw
    beforeEach(() => {
      mw = middleware({
        limit: 2,
        reset: '1 minute'
      })
    })

    it('should return a function()', () => {
      expect(mw).to.be.a.Function
    })

    it('should accept three arguments', () => {
      expect(mw.length).to.equal(3)
    })
  })

  describe('Middleware functional test', () => {
    var req, res, middlewareOpt
    middlewareOpt = {
      limit: 5,
      reset: '1 minute'
    }

    beforeEach(() => {
      req  = httpMocks.createRequest({
        originalUrl: '/user/42',
        ip: '127.0.0.1'
      })
      res = httpMocks.createResponse()
    })

    it('should pass ratelimitObj', (done) => {
      var mw = middleware(middlewareOpt)

      mw(req, res, (err) => {
        should.not.exist(err)
        should.exist(req.rateLimitObj)
        should.exist(req.rateLimitObj.limit)
        should.exist(req.rateLimitObj.reset)
        should.exist(req.rateLimitObj.remaining)

        req.rateLimitObj.limit.should.equal(5)
        req.rateLimitObj.remaining.should.equal(4)
        console.log(res.getHeader('X-RateLimit-Limit'))
        done()
      })
    })

    it('should set header', (done) => {
      var mw = middleware(middlewareOpt)

      mw(req, res, (err) => {
        should.not.exist(err)
        should.exist(res.getHeader('X-RateLimit-Limit'))
        should.exist(res.getHeader('X-RateLimit-Remaining'))
        should.exist(res.getHeader('X-RateLimit-Reset'))
        done()
      })
    })
  })
})