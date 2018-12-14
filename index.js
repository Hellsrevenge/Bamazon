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

connection.connect(function(err) {
    if (err) throw err;
    // runSearch();2
    displayAll()
});

function displayAll(){
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("item_id: " + res[i].item_id + " || product_name: " + res[i].product_name + " || price: " + res[i].price);
        }
        runSearch();
    });
};

function runSearch() {
    inquirer
        .prompt([
            {
            name: "item_id",
            message: "What would you like to buy?"
        },
            {
                name: "quantity",
                message: "How many units would you like to buy?"
            }
        ])
        .then(function(answer) {
            order(answer.item_id,answer.quantity);
        });
}

 function order(item_id,quantity) {
     var query = "SELECT * FROM products WHERE ?";
     connection.query(query, {item_id: item_id}, function(err, data) {
         if (err) throw err;
         if (data.length<=0){
             console.log(clc.xterm(49)("ERROR! Product with id " + item_id + "  is not found"));
             runSearch();
         } else {
             if (data[0].stock_quantity >= quantity) {
                 var query = "UPDATE products SET ? WHERE ?";
                 connection.query(query, [{stock_quantity: (data[0].stock_quantity - quantity)}, {item_id: item_id}]);
                 var total = quantity * data[0].price;
                 console.log(clc.green("Your total is: $" + total + ". Thank you for your purchase!"));
                 runSearch();
             } else {
                 console.log(clc.red("Insufficient quantity!"));
                 runSearch();
             }
         }
         });
 }

