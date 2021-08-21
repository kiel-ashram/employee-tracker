USE employees_db;
INSERT INTO departments (name)
VALUES
  ('Production'),
  ('HMU'),
  ('Talent'),
  ('Camera'),
  ('Electric'),
  ('Grip'),
  ('Art'),
  ('Catering'),
  ('Sound');

INSERT INTO roles (title, salary, departmentId)
VALUES
  ('Director', 700.90, 1),
  ('Cinematographer', 298, 4),
  ('Assistant Director', 235, 1),
  ('Key Grip', 87.65, 6),
  ('Best Boy Elec', 200.50, 5);

INSERT INTO employees (firstName, lastName, roleId, managerId)
VALUES
  ('Rick', 'Famuylwa', 1, 1),
  ('Rodrigo', 'Prieto', 2, 2);