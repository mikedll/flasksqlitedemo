
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

      var hashtag_filter = function() {
          var btn = $('.hashtag_link.btn-primary');
          if( btn.length === 0 ) return null;
          return btn.first().data('filter');
      };

      var renderNote = function(note, prepend) {
          var hashtag = hashtag_filter();
          if(hashtag !== null) {
              var t = new RegExp('#' + hashtag);
              if(!t.test(note.title)) return;
          }

          if( $('.notes ul li#note' + note.id).length > 0) return;

          var li = $('<li id="note' + note.id + '"></li>');
          li.append('<div class="title"><strong>' + note.id + '</strong> - ' + note.title + '</div>');
          li.append('<div class="date">' + note.created_at + '</div>');
          if (prepend === true) {
              $('.notes ul').prepend(li);
          }
          else {
              $('.notes ul').append(li);              
          }
      };

      var renderHashtag = function(hashtag) {
          var pretty_title = hashtag.title + ' (' + hashtag.notes_count + ')';
          if( $('.hashtags button#hashtag' + hashtag.id).length > 0) {
              $('.hashtags button#hashtag' + hashtag.id).text(pretty_title);
              return;
          }
          var button = $('<button class="hashtag_link" data-filter="'+ hashtag.title + '" id="hashtag' + hashtag.id + '">' + pretty_title + '</button>');
          $('.hashtags_options').append(button);
      };

      var reloadHashtags = function() {
          hashtags({
                       'success': function(data, textSTatus, jqXhr) {
                           $.each(data, function(i, hashtag) { return renderHashtag(hashtag); });
                       } 
                   });          
      };

      var reloadNotes = function() {
          var hashtag = hashtag_filter();
          notes({
                    'data': (hashtag === null ? {} : {'filter' : hashtag}),
                    'success': function(data, textStatus, jqXhr) {
                        $('.notes ul').empty();
                        $.each(data, function(i, note) { return renderNote(note); });
                    }
                  });
          
      };

      var noteCreated = function(data, textStatus, jqXhr) {
          renderNote(data, true);
          $('#note_title').val('');
          reloadHashtags();
      };

      $('.premade_note_options').on('click', 'button.premade_link', function() {
                         notes({
                                   'type': 'post',
                                   'data': {'note[title]': $(this).text()},
                                   'success': noteCreated
                               });
                             });

      
      $('.hashtags_options').on('click', 'button.hashtag_link', function(e) {
                                    if($(this).hasClass('btn-primary')) {
                                        $(this).removeClass('btn-primary');
                                    }
                                    else {
                                      $(this).parent().find('button.hashtag_link').removeClass('btn-primary');
                                      $(this).addClass('btn-primary');
                                    }
                                    reloadNotes();
                                  });

      $('form.note-form').on('submit', function() {
                         notes({
                                   'type': 'post',
                                   'data': $('form').serializeArray(),
                                   'success': noteCreated
                               });
                         return false;
                     });

      reloadHashtags();
      reloadNotes();
      $('#note_title').focus();

      
  });