$(function() {

  function addPageToList(title) {
    $('.page_list').append('<div class="existing_page">' + title +
          '<a class="delete_button"><a class="edit_button"></div>');
  }

  $.get('/api/pages', function(data) {
    for (var page in data) {
      addPageToList(data[page].page.title);
    }
  });

  $('.add_button').click(function(e) {
    $.post('/api/pages', { title: $('.page_title').val(), user_id: user_id },
      function(data) {
        addPageToList(data.page.title);
      });
  });

});
