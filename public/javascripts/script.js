$(function() {

  $.get('/api/pages', function(data) {
    for (var page in data) {
      $('.page_list').append('<div class="existing_page">' + data[page].page.title +
        '</div>');
    }
  });

  $('.add_button').click(function(e) {
    $.post('/api/pages', { title: $('.page_title').val(), user_id: user_id },
      function(data) {
        $('.page_list').append('<div class="existing_page">' + data.page.title +
          '</div>');
      });
  });

});
