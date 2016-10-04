const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const assert = require('chai').assert
const should = require('chai').should()
const httpMocks = require('node-mocks-http')

const middleware = require('../ratelimit').rateLimit

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
        should.exist(req.rateLimitObj.requestKey)        
        should.exist(req.rateLimitObj.objectKey)
        should.exist(req.rateLimitObj.objectKey.limit)
        should.exist(req.rateLimitObj.objectKey.reset)
        should.exist(req.rateLimitObj.objectKey.remaining)

        req.rateLimitObj.requestKey.should.equal('127.0.0.1:ratelimit:/user/42')
        req.rateLimitObj.objectKey.limit.should.equal(5)
        req.rateLimitObj.objectKey.remaining.should.equal(4)
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

  describe('Middleware option test (Redis and key generator)', () => {
    var req, res, middlewareOpt
    middlewareOpt = {
      limit: 5,
      reset: '1 minute',
      keyGenerator: (req, res) => {
        return req.ip + ':anjay'
      }
    }

    beforeEach(() => {
      req  = httpMocks.createRequest({
        originalUrl: '/user/42',
        ip: '127.0.0.1'
      })
      res = httpMocks.createResponse()
    })

    it('should create key 127.0.0.1:anjay', (done) => {
      var mw = middleware(middlewareOpt)

      mw(req, res, (err) => {
        should.not.exist(err)
        should.exist(req.rateLimitObj)
        should.exist(req.rateLimitObj.requestKey)        
        should.exist(req.rateLimitObj.objectKey)
        should.exist(req.rateLimitObj.objectKey.limit)
        should.exist(req.rateLimitObj.objectKey.reset)
        should.exist(req.rateLimitObj.objectKey.remaining)

        req.rateLimitObj.requestKey.should.equal('127.0.0.1:anjay')
        req.rateLimitObj.objectKey.limit.should.equal(5)
        req.rateLimitObj.objectKey.remaining.should.equal(4)
        done()
      })
    })
  })

  describe('Middleware time test', () => {
    var req, res, middlewareOpt
    middlewareOpt = {
      limit: 5,
      reset: '10 seconds'
    }

    beforeEach(() => {
      req  = httpMocks.createRequest({
        originalUrl: '/user/42',
        ip: '127.0.1.1'
      })
      res = httpMocks.createResponse()
    })

    it('should create key 127.0.0.1:anjay', (done) => {
      middlewareOpt.limitCallback = (req, res, next) => {
        should.exist(req.rateLimitObj)
        should.exist(req.rateLimitObj.limit)
        should.exist(req.rateLimitObj.reset)
        should.exist(req.rateLimitObj.remaining)

        req.rateLimitObj.limit.should.equal(5)
        req.rateLimitObj.remaining.should.equal(0)
        done()
      }
      var mw = middleware(middlewareOpt)

      function disposeMiddleware (times) {
        mw(req, res, (err) => {
          if (err) console.log(err)
          should.not.exist(err)
          should.exist(req.rateLimitObj)
          should.exist(req.rateLimitObj.requestKey)        
          should.exist(req.rateLimitObj.objectKey)
          should.exist(req.rateLimitObj.objectKey.limit)
          should.exist(req.rateLimitObj.objectKey.reset)
          should.exist(req.rateLimitObj.objectKey.remaining)

          req.rateLimitObj.objectKey.limit.should.equal(5)
          req.rateLimitObj.objectKey.remaining.should.equal(middlewareOpt.limit - (times + 1))
          disposeMiddleware(times+1)
        }) 
      }

      disposeMiddleware(0)
    })
  })
})