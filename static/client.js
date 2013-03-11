
$(function(){
   
      $('form').bind('submit', function() {
                     $.ajax({
                                'url': '/',
                                'type': 'post',
                                'data': $('form').serializeArray(),
                                'success': function(data, textStatus, jqXhr) {
                                    var li = $('<li></li>');
                                    li.append('<div class="title">' + data.title + '</div>');
                                    li.append('<div class="date">' + data.created_at + '</div>');
                                    $('.notes').append(li);
                                }
                            });
                     return false;
                 });

      $('#note_title').focus();

      
  });