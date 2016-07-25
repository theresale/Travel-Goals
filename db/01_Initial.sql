DROP TABLE IF EXISTS team;
DROP TABLE IF EXISTS team_member;
DROP TABLE IF EXISTS todo_list;

CREATE TABLE team (
	id 				serial PRIMARY KEY,
	name 			text
);

ALTER TABLE team OWNER TO scrum_server;

CREATE TABLE team_member (
	id 			serial PRIMARY KEY,
	username 	text,
	password	text,
	team_id 	integer,
		CONSTRAINT fk_team_member_to_team
		FOREIGN KEY (team_id)
		REFERENCES team (id)
);

ALTER TABLE team_member OWNER TO scrum_server;

CREATE TABLE todo_list (
	id 				serial PRIMARY KEY,
	task			text,
	team_member_id 	integer,
	team_id 		integer,
		CONSTRAINT fk_todo_list_to_team_member
		FOREIGN KEY (team_member_id)
		REFERENCES team_member (id),
		CONSTRAINT fk_todo_list_to_team
		FOREIGN KEY (team_id)
		REFERENCES team (id)
);

ALTER TABLE todo_list OWNER TO scrum_server;
