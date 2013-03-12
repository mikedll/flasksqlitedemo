
import re
import json
import sqlite3
import os
from contextlib import closing
from flask import g, Flask, render_template, url_for, request

DATABASE = 'data.db'

app = Flask(__name__)

# schema load
def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('schema.sql') as f:
            db.cursor().executescript(f.read())
        db.commit()

def query_db(query, args=(), one=False):
    cur = g.db.execute(query, args)
    rv = [dict((cur.description[idx][0], value)
               for idx, value in enumerate(row)) for row in cur.fetchall()]
    return (rv[0] if rv else None) if one else rv

def connect_db():
    sqlite_db = sqlite3.connect(DATABASE)
    sqlite_db.row_factory = sqlite3.Row
    return sqlite_db

@app.before_request
def before_request():
    g.db = connect_db()

@app.teardown_request
def teardown_request(exception):
    if hasattr(g, 'db'):
        g.db.close()

# index
@app.route('/')
def index():
    premade = ['Go to sleep', 'Wake up', 'Start/resume work', 'pause/stop work']
    return render_template('index.html', premade=premade)


@app.route('/hashtags')
def hashtags_index():
    hashtags = query_db('select hashtags.*, count(hashtags_notes.id) as notes_count from hashtags ' +
                        'inner join hashtags_notes on hashtags.id = hashtags_notes.hashtag_id ' +
                        'group by hashtags.id '
                        'order by created_at desc ')
    return json.dumps(hashtags)

# notes 
@app.route('/notes')
def notes_index():
    notes = []
    if not request.args.has_key('filter'):
        print "normal"
        notes = query_db('select * from notes order by created_at desc')
    else:
        notes = query_db('select notes.* from notes ' + 
                         'inner join hashtags_notes on notes.id = hashtags_notes.note_id ' + 
                         'inner join hashtags on hashtags_notes.hashtag_id = hashtags.id ' + 
                         'where hashtags.title = ? ' +
                         'order by created_at desc',
                         [request.args['filter']])

    return json.dumps(notes)

# creating a note
@app.route('/notes', methods=['POST'])
def notes_create():
    cursor = g.db.execute('insert into notes (title, created_at) values (?, datetime("now"))', [request.form['note[title]']])
    g.db.commit()
    note_id = cursor.lastrowid
    
    hashtags = re.findall('#([a-zA-Z0-9]+)', request.form['note[title]'])
    for found_hashtag in hashtags:
        hashtag_id = None
        hashtag = query_db('select * from hashtags where title = ?', [found_hashtag.lower()], True)
        if hashtag is None:
            cursor = g.db.execute('insert into hashtags (title, created_at) values (?, datetime("now"))', [found_hashtag.lower()])
            g.db.commit()
            hashtag_id = cursor.lastrowid
        else:
            hashtag_id = hashtag['id']
          
        g.db.execute('insert into hashtags_notes (hashtag_id, note_id, created_at) values (?, ?, datetime("now"))', [hashtag_id, note_id])
        g.db.commit()
    
    note = query_db('select * from notes where id = ?', [note_id], True)
    return json.dumps(note)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)




