$(function() {

  function addPageToList(title, id) {
    $('.page_list').append('<div class="existing_page" id="' + id +
          '">' + title + '<a class="delete_button"><a class="edit_button">' +
          '</div>');
  }

  $.get('/api/pages', function(data) {
    for (var page in data) {
      addPageToList(data[page].page.title, data[page].page.page_id);
    }
    bindDelete();
  });

  $('.add_button').click(function(e) {
    $.post('/api/pages', { title: $('.page_title').val(), user_id: user_id },
      function(data) {
        addPageToList(data.page.title, data.page.page_id);
        bindDelete();
      });
  });

  function bindDelete() {
    $('.delete_button').each(function() {
      $(this).bind('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        var page_name = '#' + e.target.parentElement.id;
        if ($(page_name).hasClass('confirm')) {
          // delete elem
          $.ajax({
            url: '/api/page/' + page_name.substr(1),
            type: 'DELETE',
            data: { user_id: user_id },
            success: function(resp) {
              $(page_name).slideUp();
            }
          });
        } else {
          $(page_name).addClass('confirm');
          $(page_name).find('.delete_button').css('display', 'inline-block');
          $(page_name).find('.edit_button').css('display', 'none');
        }
      });
    });
  }

});
