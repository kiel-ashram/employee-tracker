// get the client
const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');

//create connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employees_db'
});

connection.connect(function (err) {
    if (err) throw err;
  });
//user prompts - INQUIRER
const loadPrompts = () => {
    inquirer.prompt(
        {
            type: "list",
            name: "choice",
            message: "What would you like to do today?",
            choices: [
                "view all departments",
                "view all roles",
                "view all employees",
                "add a department",
                "add a role",
                "add an employee",
                "update an employee role",
                "delete a department",
                "exit the app"
            ]
        }
    )
        .then(res => {
            switch (res.choice) {
                case "view all departments":
                    viewAllDepartments()
                    break;
                case "view all roles":
                    viewAllRoles()
                    break;
                case "view all employees":
                    viewAllEmployees()
                    break;
                case "add a department":
                    addDepartment()
                    break;
                case "add a role":
                    addRole()
                    break;
                case "add an employee":
                    addAnEmployee()
                    break;
                case "update an employee role":
                    updateEmployee()
                    break;
                case "delete a department":
                    deleteDepartment()
                    break;
                case "exit the app":
                    exitConnection();
                    break;
                default:
                    console.log("Option not found. That's on us.")
                    exitConnection();
                    break;
            }
        })
}

const viewAllDepartments = () => {
    connection.promise().query(`SELECT * FROM departments`)
        .then(([rows]) => {
            console.table(rows)
            loadPrompts();
        })
}

const viewAllRoles = () => {
    connection.promise().query(`SELECT * FROM roles`)
        .then(([rows]) => {
            console.table(rows)
            loadPrompts();
        })
};

const viewAllEmployees = () => {
    connection.promise().query(`SELECT employees.id, employees.firstName, employees.lastName, employees.managerId, roles.title, roles.salary, departments.name FROM employees LEFT JOIN roles ON employees.roleId = roles.id LEFT JOIN departments ON roles.departmentId = departments.id`)
        .then(([rows]) => {
            console.table(rows)
            loadPrompts();
        })
};

const addDepartment = () => {
    inquirer.prompt(
        {
            type: "input",
            name: "name",
            message: "What is the name of your new department?"
        })
        .then(res => {
            connection.promise().query(`INSERT INTO departments SET name=?`, res.name)
        })
        .then(() => console.log(`Added department!`))
        .then(() => loadPrompts());
};

const addRole = () => {
    connection.promise().query(`SELECT * FROM departments`)
        .then(([rows]) => {
            const deptArr = rows.map(row => ({ name: row.name, value: row.id }))
            inquirer.prompt([
                {
                    type: "input",
                    name: "title",
                    message: "What is the new role called?"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the average salary for this role?"
                },
                {
                    type: "list",
                    name: "departmentId",
                    message: "Which department does this role work in?",
                    choices: deptArr
                }
            ])
                .then(res => {
                    connection.promise().query(`INSERT INTO roles SET ?`, res)
                })
                .then(() => console.log(`Added role!`))
                .then(() => loadPrompts());
        })
};

const addAnEmployee = () => {
    connection.promise().query(`SELECT * FROM roles`)
        .then(([rows]) => {
            const rolesArr = rows.map(row => ({ name: row.title, value: row.id }))
            connection.promise().query(`SELECT * FROM employees`)
                .then(([rows]) => {
                    const managerArr = rows.map(row => ({ name: row.firstName + ' ' + row.lastName, value: row.id }))
                    inquirer.prompt([
                        {
                            type: "input",
                            name: "firstName",
                            message: "What is your new employee's first name?"
                        },
                        {
                            type: "input",
                            name: "lastName",
                            message: "What is your new employee's last name?"
                        },
                        {
                            type: "list",
                            name: "roleId",
                            message: "Please choose a role for  your new employee",
                            choices: rolesArr
                        },
                        {
                            type: "list",
                            name: "managerId",
                            message: "Who is your new employee's manager?",
                            choices: [...managerArr, { name: "none", value: null }]
                        }
                    ])
                        .then(res => {
                            connection.promise().query(`INSERT INTO employees SET ?`, res)
                                .then(console.log(`Employee has been added!`))
                                .then(() => loadPrompts());
                        })
                });
        });
};

const updateEmployee = () => {
    //first get all employees so they can pick who
    connection.promise().query(`SELECT employees.id, employees.firstName, employees.lastName FROM employees`)
        .then(([rows]) => {
            const empArr = rows.map(row => ({ value: row.id, name: row.firstName + ' ' + row.lastName }))
            inquirer.prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Which employee role would you like to update?",
                    choices: empArr
                }
            ])
                .then(res => {
                    let id = res.employeeId
                    connection.promise().query(`SELECT roles.id, roles.title FROM roles`)
                        .then(([rows]) => {
                            const roleArr = rows.map(row => ({ value: row.id, name: row.title }))
                            inquirer.prompt([
                                {
                                    type: "list",
                                    name: "roleId",
                                    message: "What is the employee's new role?",
                                    choices: roleArr
                                }
                            ])
                                .then(res => {
                                    connection.promise().query(`UPDATE employees SET roleId=? WHERE id=?`, [res.roleId, id])
                                })
                                .then(() => console.log(`Employee has been updated.`))
                                .then(() => loadPrompts());
                        });
                });
        });
};

const deleteDepartment = () => {
    connection.promise().query(`SELECT * FROM departments`)
        .then(([rows]) => {
            const deptArr = rows.map(row => ({ value: row.id, name: row.name }))
            inquirer.prompt([
                {
                    type: "list",
                    name: "departmentId",
                    message: "Which department would you like to delete?",
                    choices: deptArr
                }
            ])
                .then(res => {
                    connection.promise().query(`DELETE FROM departments WHERE id=?`, [res.departmentId])
                })
                .then(() => console.log(`Department has been deleted.`))
                .then(() => loadPrompts());
        });
}

const exitConnection = () => {
    console.log("Exiting program.")
    connection.end();
}

//module.exports = connection()
loadPrompts();