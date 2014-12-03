
/*
 * GET home page.
 */

exports.index = function(req, res){
  var token;
  if (req.user) {
    token = req.user.token;
  }
  res.render('index', { title: 'Weebly', user_token: token });
};
