

/*
 * Client js responsibilities, such as posting the note.
 */
$(function(){
   
      $('form').bind('submit', function() {
                     $.ajax({
                                'url': '/',
                                'type': 'post',
                                'dataType': 'json',
                                'data': $('form').serializeArray(),
                                'complete': function(data, textStatus, jqXhr) {
                                },
                                'error': function(jxXhr, textStatus, errorThrown) {
                                },
                                'success': function(data, textStatus, jqXhr) {
                                    var li = $('<li></li>');
                                    li.append('<div class="title">' + data.title + '</div>');
                                    li.append('<div class="date">' + data.created_at + '</div>');
                                    $('.notes ul').append(li);
                                }
                                
                            });
                     return false;
                 });

      $('#note_title').focus();

      
  });