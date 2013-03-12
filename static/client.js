

/*
 * Client js responsibilities, such as posting the note.
 */
$(function(){

      var rest = function(opts) {
          return $.ajax($.extend({
              'type': 'GET',
              'dataType': 'json'
          }, opts));          
      };

      var notes = function(opts) {    return rest($.extend({'url': '/notes'},    opts)); };
      var hashtags = function(opts) { return rest($.extend({'url': '/hashtags'}, opts)); };

      var renderNote = function(note, prepend) {
          if( $('.notes ul li#note' + note.id).length > 0) return;

          var li = $('<li id="note' + note.id + '"></li>');
          li.append('<div class="title">' + note.title + '</div>');
          li.append('<div class="date">' + note.created_at + '</div>');
          if (prepend === true) {
              $('.notes ul').prepend(li);
          }
          else {
              $('.notes ul').append(li);              
          }
      };

      var renderHashtag = function(hashtag) {
          if( $('.hashtags button#hashtag' + hashtag.id).length > 0) return;
          var button = $('<button id="hashtag' + hashtag.id + '">' + hashtag.title + '</button>');
          $('.hashtags_options').append(button);
      };

      var loadRecent = function() {
          hashtags({
                       'success': function(data, textSTatus, jqXhr) {
                           $.each(data, function(i, hashtag) { return renderHashtag(hashtag); });
                       } 
                   });
          notes({
                      'success': function(data, textStatus, jqXhr) {
                          $.each(data, function(i, note) { return renderNote(note); });
                      }
                  });
          
      };

      var noteCreated = function(data, textStatus, jqXhr) {
                                       renderNote(data, true);
                                       $('#note_title').val('');

                                       hashtags({
                                                    'success': function(data, textSTatus, jqXhr) {
                                                        $.each(data, function(i, hashtag) { return renderHashtag(hashtag); });
                                                    } 
                                                });
                                   };

      $('button.premade_link').bind('click', function() {
                         notes({
                                   'type': 'post',
                                   'data': {'note[title]': $(this).text()},
                                   'success': noteCreated
                               });
                             });

      $('form').bind('submit', function() {
                         notes({
                                   'type': 'post',
                                   'data': $('form').serializeArray(),
                                   'success': noteCreated
                               });
                         return false;
                     });

      loadRecent();
      $('#note_title').focus();

      
  });