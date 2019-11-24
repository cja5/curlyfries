CREATE TABLE users(
	username VARCHAR(50) PRIMARY KEY NOT NULL,
	password VARCHAR(50) NOT NULL,	
	highscore INT NOT NULL
);


INSERT INTO users VALUES( "user","pass","0"); /* for registration form. high score at this point is always 0*/

SELECT username, highscore FROM users ;/* For high score table*/

UPDATE users
SET highscore = (new highscore)
WHERE username = "user";  /* for increasing their overall high score after every game*/