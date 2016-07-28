DROP TABLE IF EXISTS identity;
DROP TABLE IF EXISTS travel_goal;
DROP TABLE IF EXISTS goal_notes;

CREATE TABLE  identity (
	id 				serial PRIMARY KEY,
	id_token 		numeric NOT NULL,
	home_city		text,
	home_city_code  text
);

ALTER TABLE identity OWNER TO travel_goal_server;

CREATE TABLE travel_goal (
	id 				serial PRIMARY KEY,
	location_type	text,
	location 		text,
	location_code	text,
	summary			text,
	priority		text,
	identity_id 	integer,
	UNIQUE (location, identity_id),
		CONSTRAINT fk_travel_goal_to_identity
		FOREIGN KEY (identity_id)
		REFERENCES identity (id)
);

ALTER TABLE travel_goal OWNER TO travel_goal_server;

CREATE TABLE goal_notes (
	id 					serial PRIMARY KEY,
	note				text,
	travel_goal_id 		integer,
		CONSTRAINT fk_goal_notes_to_travel_goal
		FOREIGN KEY (travel_goal_id)
		REFERENCES travel_goal (id)
);

ALTER TABLE goal_notes OWNER TO travel_goal_server;
