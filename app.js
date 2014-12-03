////////////////////
// Module imports //
////////////////////

var express = require('express'),
    path = require('path'),
    http = require('http'),
    db = require('./config/db'),
    routes = require('./routes'),
    api = require('./routes/api'),
    passport = require('passport'),
    auth = require('./config/auth'),
    constants = require('./config/constants'),
    app = express();


////////////////////////
// App configurations //
////////////////////////

var RedisStore = require('connect-redis')(express);
var redis;
if (constants.REDISTOGO_URL) {
  console.log("using redistogo");
  rtg   = require('url').parse(constants.REDISTOGO_URL);
  redis = require('redis').createClient(rtg.port, rtg.hostname);
  // auth 1st part is username and 2nd is password separated by ":"
  redis.auth(rtg.auth.split(':')[1]);
} else {
  console.log("using local redis");
  redis = require("redis").createClient();
}

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session({
    secret: 'H3LL0W0RLD',
    store: new RedisStore({ client: redis })
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(function (err, req, res, next) {
    console.log(err);
    res.send(500, "Something broke");
  });
});


/////////////////
// URL Routing //
/////////////////

// Homepage
app.get('/', routes.index);

// Passport redirects to google login
app.get('/login',
    passport.authenticate('google',
        { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                  'https://www.googleapis.com/auth/userinfo.email'] }));
// Passport handle login callback
app.get(constants.Google.CALLBACK,
    passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/',
      failureFlash: 'Something went wrong while logging you in.'
    })
);

// API
// GET /api/pages (Get all pages)
app.get('/api/pages', auth.requiresLogin, api.allPages);
// GET /api/page/:id (Get a specific page)
app.get('/api/page/:id', auth.requiresLogin, api.getPage);
// POST /api/pages (Create a new page)
app.post('/api/pages', auth.requiresLogin, api.createPage);
// PUT /api/page/:id (Update a specific page)
app.put('/api/page/:id', auth.requiresLogin, api.updatePage);
// DELETE /api/page/:id (Delete a specific page)
app.delete('/api/page/:id', auth.requiresLogin, api.deletePage);


////////////////////
// Error handlers //
////////////////////

app.get('*', function(req, res){
  res.send(404);
});


////////////////////////////////////////
// helper functions for passport auth //
////////////////////////////////////////
require('./config/pass.js')(passport);


////////////////////////
// Creates the server //
////////////////////////

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
