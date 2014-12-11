var User = require('mongoose').model('User'),
    Page = require('mongoose').model('Page'),
    constants = require('./../config/constants'),
    mc = require('memjs'),
    client = mc.Client.create();


/**
 * GET all pages for a user
 */
exports.allPages = function(req, res) {
  client.get(req.user.token + '_pages', function(err, val) {
    if (val) {
      return res.send(200, JSON.parse(val));
    } else {
      Page.find({ user_id: req.user.token }, function(err, docs) {
        if (err) return err;

        client.set(req.user.token + '_pages', JSON.stringify(docs),
          function(err, _) {
          res.send(200, docs);
        }, 0);

      });
    }
  });
};

/**
 * Get a specific page.
 */
exports.getPage = function(req, res) {
  client.get(req.user.token + '_page' + req.params.id, function(err, val) {
    if (val) {
      return res.send(200, JSON.parse(val));
    } else {
      Page.find({ user_id: req.user.token },
        function(err, docs) {
          if (err) return err;
          for (var i = 0; i < docs.length; i++) {
            var page = docs[i];
            if (page.page_id === req.params.id) {

              client.set(req.user.token + '_page' + req.params.id,
                JSON.stringify(page),
                function(err, _) {
                  return res.send(200, page);
                }, 0);
            }
          }
        });
    }
  });

}

/**`
 * Create a new page
 */
exports.createPage = function(req, res) {
  User.findOne({ token: 'f574c551-928e-45e8-81c6-c964c12d5f34' }, function(err, doc) {
    if (err) return err;

    var newPage = new Page({
      user_id: req.body.user_id
    });

    newPage.page.page_id = req.user.last_page_id + 1;
    newPage.page.title = req.body.title;
    newPage.page.content = req.body.content;

    newPage.save(function(err, page) {
      if (err) return err;

      req.user.last_page_id = newPage.page.page_id;
      req.user.save(function(err, u) {

        client.set(req.body.user_id + '_page' + newPage.page.page_id,
          JSON.stringify(page),
          function(err, _) {
            return res.send(200, page);
          }, 0);
      });
    });
  });
}

/**
 * Update a page
 */
exports.updatePage = function(req, res) {
  client.delete(req.body.user_id + '_page' + req.params.id, function(_, _) {
    User.findOne({ token: req.body.user_id }, function(err, doc) {
      if (err) return err;

      Page.findOne({ 'user_id': req.body.user_id, 'page.page_id': req.params.id },
        function(err, doc) {
          if (err) return err;
          doc.page.title = req.body.title;
          doc.page.content = req.body.content;

          doc.save(function(err, page) {
            if (err) return err;

            return res.send(200);
          });
        });
    });
  });
}

/**
 * Delete a page
 */
exports.deletePage = function(req, res) {
  User.findOne({ token: req.body.user_id }, function(err, doc) {
    if (err) return err;

    Page.find({ 'user_id': req.body.user_id, 'page.page_id': req.params.id })
        .remove(function(err) {
          if (err) return err;

          client.delete(req.body.user_id + '_page' + req.params.id, function(_, _) {
            return res.send(200);
          });
        });
  });
}
