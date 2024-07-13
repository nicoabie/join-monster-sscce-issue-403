DROP TABLE IF EXISTS things;
CREATE TABLE things (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255),
  description VARCHAR(255),
  things_type VARCHAR(255)
);

insert into things (name, description, things_type) values ('A Foo Thing', null, 'Foo');
insert into things (name, description, things_type) values ('A Bar Thing', 'Bar Description', 'Bar');
insert into things (name, description, things_type) values ('A Baz Thing', 'Baz Description', 'Baz');
