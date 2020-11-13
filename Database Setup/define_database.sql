DROP TABLE IF EXISTS ExpertClasses;
DROP TABLE IF EXISTS ExpertSubjects;
DROP TABLE IF EXISTS ExpertLinks;
DROP TABLE IF EXISTS Subjects;
DROP TABLE IF EXISTS Classes;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users
(
	user_id INT AUTO_INCREMENT NOT NULL,
	username VARCHAR(255) NOT NULL,
	firstName VARCHAR(255) NOT NULL,
	lastName VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	PRIMARY Key (user_id)
) ENGINE=InnoDB;

CREATE TABLE Subjects
(
	subject_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	description VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE ExpertSubjects
(
	user_id INT AUTO_INCREMENT NOT NULL,
	subject_id INT NOT NULL,
	CONSTRAINT PK_ExpertSubjects PRIMARY KEY (user_id, subject_id),
		FOREIGN KEY (subject_id)
			REFERENCES Subjects (subject_id)
			ON UPDATE CASCADE
			ON DELETE CASCADE,
		FOREIGN KEY (user_id)
			REFERENCES Users (user_id)
			ON UPDATE CASCADE
			ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Classes
(
	class_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	description VARCHAR(255) NOT NULL 
) ENGINE=InnoDB;

CREATE TABLE ExpertClasses
(
	user_id INT NOT NULL,
	class_id INT NOT NULL,
	CONSTRAINT Pk_ExpertClasses PRIMARY KEY (user_id, class_id),
		FOREIGN KEY (class_id)
			REFERENCES Classes (class_id)
			ON UPDATE CASCADE
			ON DELETE CASCADE,
		FOREIGN KEY (user_id)
			REFERENCES Users (user_id)
			ON UPDATE CASCADE
			ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE ExpertLinks
(
	user_id INT NOT NULL,
	link  VARCHAR(255) NOT NULL,
	link_type VARCHAR(255) NOT NULL,
		FOREIGN KEY (user_id)
			REFERENCES Users (user_id)
			ON UPDATE CASCADE
			ON DELETE CASCADE
) ENGINE=InnoDB;


INSERT INTO Users VALUES
	(1, 'levinw', 'Will', 'Levin', 'HelloWorld'),
	(2, 'wyborskv', 'Vincent', 'Wyborski', 'HelloWorld'),
	(3, 'paethsa', 'Sawyer', 'Paeth', 'HelloWorld'),
	(4, 'hallerc', 'Chris', 'Haller', 'HelloWorld');

INSERT INTO Subjects VALUES
	(1, 'Web Development'),
	(2, 'Databases'),
	(3, 'Python'),
	(4, 'Javascript'),
	(5, 'C++');

INSERT INTO Classes VALUES
	(1, 'cs361'),
	(2, 'cs290'),
	(3, 'cs340');

INSERT INTO ExpertSubjects VALUES
	(1, 5),
	(1, 2),
	(2, 1),
	(2, 4),
	(3, 4),
	(3, 1),
	(4, 4),
	(4, 1),
	(4, 3);

INSERT INTO ExpertClasses VALUES
	(1, 1),
	(1, 2),
	(1, 3),
	(2, 1),
	(3, 1),
	(4, 1);