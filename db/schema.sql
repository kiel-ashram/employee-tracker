DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;

CREATE TABLE departments (
    id INTEGER(10) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE roles (
    id INTEGER(10) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    departmentId INTEGER(2),
    INDEX departmentIndex (departmentId),
    CONSTRAINT fkdepartment FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE CASCADE
);

CREATE TABLE employees (
    id INTEGER(10) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    firstName VARCHAR(30),
    lastName VARCHAR(30),
    roleId INTEGER(2),
    managerId INTEGER(11),
    INDEX roleIndex (roleId),
    CONSTRAINT fkrole FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE,
    INDEX managerIndex (managerId),
    CONSTRAINT fkmanager FOREIGN KEY (managerId) REFERENCES employees(id) ON DELETE CASCADE
);