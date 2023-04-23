### Schema


USE kk4zlkdezqtk5us3;

CREATE TABLE questions
(
	id int NOT NULL AUTO_INCREMENT,
    ifia_number varchar(255) NOT NULL,
	question varchar(255) NOT NULL,
	answer_a varchar(255) not null,
	answer_b varchar(255) not null,
	answer_c varchar(255) not null,
	answer_d varchar(255) not null,
	answer_correct varchar(255) not null,
	materials_link varchar(255) ,
	section varchar(255) ,
	accessed BOOLEAN DEFAULT false,
	PRIMARY KEY (id)
);

CREATE TABLE users
(
	id int NOT NULL AUTO_INCREMENT,
	u_name varchar(255) NOT NULL,
	u_email varchar(255) not null,
	u_tries varchar(255) not null,
	u_lastscore varchar(255) not null,
	PRIMARY KEY (id)
);

