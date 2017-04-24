'use strict'

var SwaggerExpress = require('swagger-express-mw')
var SwaggerUi = require('swagger-tools/middleware/swagger-ui')
var express = require('express')
let bodyParser = require('body-parser');
var path = require('path')
var request = require('request')
var morgan = require('morgan')
var expressJWT = require('express-jwt');
var app = express()

module.exports = app // for testing

var config = {
    appRoot: __dirname // required config
}

var backendReise = process.env.BACKEND_REISE || 'http://localhost:8080'
console.log('Backend Reise: ', backendReise)
var backendOrch = process.env.BACKEND_ORCH || 'http://localhost:8080'
console.log('Backend Orch: ', backendOrch)

SwaggerExpress.create(config, function (err, swaggerExpress) {
    if (err) {
        throw err
    }

    app.use('/redirect_api',
        expressJWT({
            secret: 'awesomeBookingSecret'
        }).unless({ path: ['/auth/github'] }));

    // install middleware
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(SwaggerUi(swaggerExpress.runner.swagger))
    swaggerExpress.register(app)

    var port = process.env.PORT || 8080

    // set static files location used for requests that our frontend will make
    app.use(morgan('dev'))
    app.use(express.static(path.join(__dirname, '/public')))

    app.get('/redirect_api/locations*', function (req, res) {
        request(`${backendReise}/api/locations${req.params[0]}${req._parsedUrl.search ? req._parsedUrl.search : ''}`).pipe(res)
    })
    app.get('/redirect_api/trips*', function (req, res) {
        request(`${backendReise}/api/trips${req.params[0]}${req._parsedUrl.search ? req._parsedUrl.search : ''}`).pipe(res)
    })
    app.get('/redirect_api/offers*', function (req, res) {
        request(`${backendReise}/api/offers${req.params[0]}${req._parsedUrl.search ? req._parsedUrl.search : ''}`).pipe(res)
    })
    app.get('/redirect_api/prebookings*', function (req, res) {
        request(`${backendOrch}/api/prebookings${req.params[0]}${req._parsedUrl.search ? req._parsedUrl.search : ''}`).pipe(res)
    })
    app.get('/redirect_api/bookings*', function (req, res) {
        request(`${backendOrch}/api/bookings${req.params[0]}${req._parsedUrl.search ? req._parsedUrl.search : ''}`).pipe(res)
    })

    app.get('/contributors', function (req, res) {
        var options = {
            url: 'https://api.github.com/repos/schlpbch/bookingAPI/contributors',
            headers: {
                'User-Agent': 'request'
            }
        };
        request.get(options, function(err, response, contributors) {
            res.send(contributors)
        })
    })

    app.listen(port)

    if (swaggerExpress.runner.swagger.paths['/offers']) {
        console.log('try this: http://localhost:' + port + '/app')
    }
})
