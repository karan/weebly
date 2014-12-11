var User = require('mongoose').model('User'),
    Page = require('mongoose').model('Page');

/**
 * GET all pages for a user
 */
exports.allPages = function(req, res) {
  Page.find({ user_id: req.user.token }, function(err, docs) {
    if (err) return err;

    res.send(200, docs);
  });
};

/**
 * Get a specific page.
 */
exports.getPage = function(req, res) {
  Page.find({ user_id: req.user.token },
    function(err, docs) {
      if (err) return err;
      for (var i = 0; i < docs.length; i++) {
        var page = docs[i];
        if (page.page_id === req.params.id) {
          return res.send(200, page);
        }
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
        return res.send(200, page);
      });
    });
  });
}

/**
 * Update a page
 */
exports.updatePage = function(req, res) {
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

          return res.send(200);
        });
  });
}
