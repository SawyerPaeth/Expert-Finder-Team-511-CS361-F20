DROP TABLE IF EXISTS ExpertClasses;
DROP TABLE IF EXISTS ExpertSubjects;
DROP TABLE IF EXISTS ExpertLinks;
DROP TABLE IF EXISTS ExpertOrganizations;
DROP TABLE IF EXISTS Subjects;
DROP TABLE IF EXISTS Classes;
DROP TABLE IF EXISTS Organizations;
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


CREATE TABLE Organizations
(
	org_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	description VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE ExpertOrganizations
(
	user_id INT AUTO_INCREMENT NOT NULL,
	org_id INT NOT NULL,
	CONSTRAINT Pk_ExpertSubjects PRIMARY KEY (user_id, org_id),
		FOREIGN KEY (org_id)
			REFERENCES Organizations (org_id)
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
	(1, 'levinw@oregonstate.edu', 'Will', 'Levin', 'n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg='),
	(2, 'wyborskv@oregonstate.edu', 'Vincent', 'Wyborski', 'n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg='),
	(3, 'paethsa@oregonstate.edu', 'Sawyer', 'Paeth', 'n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg='),
	(4, 'hallerc@oregonstate.edu', 'Chris', 'Haller', 'n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg=');

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

INSERT INTO ExpertLinks VALUES
	(1, "https://github.com/SawyerPaeth/Expert-Finder-Team-511-CS361-F20", "github"),
	(1, "https://github.com/nawazu/cs340-project", "github");
	
INSERT INTO Organizations VALUES
	(1, "IEEE"),
	(2, "Free Masons"),
	(3, "SWE");

INSERT INTO ExpertOrganizations VALUES
	(1, 1),
	(1, 2),
	(2, 3),
	(2, 1),
	(3, 3),
	(3, 2),
	(4, 1);
