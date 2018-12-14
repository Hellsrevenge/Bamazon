var clc = require("cli-color");
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    displayMenus();
});

function displayMenus() {
    inquirer.prompt([
        {
            name: "choice",
            type: "rawlist",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit"
            ],
            message: "Choose an option"
        },
    ]).then(function (answer) {
        if (answer.choice === "View Products for Sale") {
            listProducts();
        } else if (answer.choice === "View Low Inventory") {
            lowInventory();
        } else if (answer.choice === "Add to Inventory") {
            addInventory();
        } else if (answer.choice === "Add New Product") {
            addProduct();
        } else if (answer.choice === "Exit") {
            process.exit();
        }
    });
}

function listProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("item_id: " + res[i].item_id + " || product_name: " + res[i].product_name + " || price: " + res[i].price + " || stock_quantity: " + res[i].stock_quantity);
        }
        displayMenus();
    });
}

function lowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5 ";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("item_id: " + res[i].item_id + " || product_name: " + res[i].product_name + " || price: " + res[i].price + " || stock_quantity: " + res[i].stock_quantity);
        }
        displayMenus();
    });
}

function addInventory() {
    inquirer.prompt([
        {
            name: "item_id",
            message: "Choose a product"
        },
        {
            name: "add",
            message: "How many to add"
        },
    ]).then(function (answer) {
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, {item_id: answer.item_id}, function (err, data) {
            if (err) throw err;
            if (data.length <= 0) {
                console.log(clc.xterm(49)("ERROR! Product with id " + answer.item_id + "  is not found"));
                displayMenus();
            } else {
                var query = "UPDATE products SET ? WHERE ?";
                connection.query(query, [{stock_quantity: (parseInt(data[0].stock_quantity) + parseInt(answer.add))}, {item_id: answer.item_id}]);
                listProducts();
            }
        });
    });
}

function addProduct() {
    inquirer.prompt([
        {
            name: "product_name",
            message: "What do you want to add"
        },
        {
            name: "department",
            message: "Which department?"
        },
        {
            name: "price",
            message: "Price?"
        },

        {
            name: "add",
            message: "How many to add?"
        },
    ]).then(function (answer) {
        var query = "INSERT INTO products (product_name, department_name, price,stock_quantity) VALUES (?,?,?,?)";
        connection.query(query, [
            answer.product_name,
            answer.department,
            answer.price,
            answer.add
        ], function (err, data) {
            listProducts();
        });
    });
}

