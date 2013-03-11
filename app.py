
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

# basic listing of notes
@app.route('/')
def index():
    notes = query_db('select * from notes')
    return render_template('index.html', notes=notes)

# creating a note
@app.route('/', methods=['POST'])
def create():
    cursor = g.db.execute('insert into notes (title, created_at) values (?, datetime("now"))', [request.form['note[title]']])
    g.db.commit()
    note = query_db('select * from notes where id = ?', [cursor.lastrowid], True)
    return json.dumps(note)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)




