
drop table 'notes' if exists notes;;

create table 'notes' (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       title TEXT,
       created_at DATETIME
);




