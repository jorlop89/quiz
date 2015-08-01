var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var partials = require('express-partials');

var methodOverride = require('method-override');

var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));




app.use(function(req, res, next){

    var tiempo_inactivo_user;

    req.session.t1 = req.session.t2 || 0;
    req.session.t2 = new Date().getTime();
    tiempo_inactivo_user = req.session.t2 - req.session.t1;
    console.log(tiempo_Inactivo);

    if((req.session.user) && (tiempo_inactivo_user > 120000)){
        console.log("Excedido tiempo de sesion:" + (tiempo_inactivo_user/1000) + " s");
        req.session.destroy();
        //delete req.session.user;
        //res.redirect(req.session.redir.toString());
    }

    else{
        next();
    }

});



//Helpers dinamicos
app.use(function(req, res, next){

	//Guardar path en session, redir para despues de login.
	if (!req.path.match(/\/login|\/logout/)){
		req.session.redir = req.path;
	}

	//Hacer visible req.session en las vistas
	res.locals.session = req.session;
	next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err, 
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
