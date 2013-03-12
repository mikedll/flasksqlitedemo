
drop table if exists 'notes';
create table 'notes' (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       title TEXT,
       created_at DATETIME
);


drop table if exists 'hashtags';
create table if not exists  'hashtags' (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       title TEXT,
       created_at DATETIME
);

drop table if exists 'hashtags_notes';
create table if not exists 'hashtags_notes' (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       hashtag_id INTEGER,
       note_id INTEGER,
       created_at DATETIME
);



