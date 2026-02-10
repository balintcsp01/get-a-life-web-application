INSERT INTO categories ( name ) VALUES ('Sport');
INSERT INTO categories ( name ) VALUES ('Craft');
INSERT INTO categories ( name ) VALUES ('Art');
INSERT INTO categories ( name ) VALUES ('Music');
INSERT INTO categories ( name ) VALUES ('Games');
INSERT INTO categories ( name ) VALUES ('Lifestyle');
INSERT INTO categories ( name ) VALUES ('Tech');
INSERT INTO categories ( name ) VALUES ('Other');

INSERT INTO hobbies (category_id, name, min_price, max_price, description)
VALUES (
           (SELECT id FROM categories WHERE name = 'Sport'),
           'Running',
           0,
           50,
           'A simple sport that can be done anywhere and helps improve endurance and mental health.'
       );

INSERT INTO hobbies (category_id, name, min_price, max_price, description)
VALUES (
           (SELECT id FROM categories WHERE name = 'Music'),
           'Playing Guitar',
           15,
           70,
           'Learning to play acoustic or electric guitar, from beginner to advanced level.'
       );

INSERT INTO hobbies (category_id, name, min_price, max_price, description)
VALUES (
           (SELECT id FROM categories WHERE name = 'Art'),
           'Drawing',
           5,
           100,
           'Creative self-expression through pencil, ink, or digital drawing.'
       );

INSERT INTO hobbies (category_id, name, min_price, max_price, description)
VALUES (
           (SELECT id FROM categories WHERE name = 'Tech'),
           'Programming',
           0,
           2000,
           'Learning software development as a hobby or for career growth.'
       );

INSERT INTO hobbies (category_id, name, min_price, max_price, description)
VALUES (
           (SELECT id FROM categories WHERE name = 'Games'),
           'Board Games',
           15,
           111,
           'Playing board games with friends or family, including strategy and party games.'
       );

