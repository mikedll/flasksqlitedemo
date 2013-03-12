

# Setting this app up locally

Install flask, othe reqs

    pip install -r requirements.txt
    
Load the schema

    python
    > from app import init_db
    > init_db() # run schema

Run webapp

    python app.py

Connect to localhost:5000

# Reqs

http://baum.iriscouch.com/note-sampleapp/_design/HashNote/index.html 

Filter notes by hashtag (and unfilter)

List recent notes incl. post date

Add note from list

Add custom note


# Implementation

As in the example app, results are returned in JSON form.

They retrieve json from the client...so we should do the same...
