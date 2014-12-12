$(function() {

  function addPageToList(title, id) {
    $('.new_page').slideDown();
    $('.page_list').append('<div class="existing_page" id="' + id +
          '">' + title + '<a class="delete_button"><a class="edit_button">' +
          '</div>');
  }

  $.get('/api/pages', function(data) {
    for (var page in data) {
      addPageToList(data[page].page.title, data[page].page.page_id);
    }
    bindDelete();
    bindEdit()
  });

  $('.add_button').click(function(e) {
    $.post('/api/pages', { title: $('.page_title').val(), user_id: user_id },
      function(data) {
        addPageToList(data.page.title, data.page.page_id);
        bindDelete();
        bindEdit()
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

  function bindEdit() {
    $('.edit_button').each(function() {
      $(this).bind('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        var page_name = '#' + e.target.parentElement.id;
        if ($(page_name).find('input').length > 0) {
          console.log("second click");
          var new_name = $(page_name).find('input').val();
          $.ajax({
            url: '/api/page/' + page_name.substr(1),
            type: 'PUT',
            data: { user_id: user_id, title: new_name },
            success: function(resp) {
              $(page_name).replaceWith('<div class="existing_page" id="' + page_name.substr(1) + '">' +
                  new_name + '<a class="delete_button"><a class="edit_button">' +
                  '</div>');
              bindEdit();
              bindDelete();
            }
          });
        } else {
          var $edit = $(page_name).find('.edit_button');
          $(page_name).html('<input class="page_title" value="' +
              $(page_name).text() + '">');
          $($edit).css('display', 'inline-block');
          $(page_name).append($edit);
          bindEdit();
        }
      });
    });
  }

});
