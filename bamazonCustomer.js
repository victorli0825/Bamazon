var mysql = require('mysql');
var inquirer = require('inquirer');
//create connection to db
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "Bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {
	connection.query('SELECT * FROM products', function(err, res) {
        console.log("Welcome to Bamazon!");
        console.log("===========================================");

        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].ItemID + " | " + "Product: " + res[i].ProductName + " | " + "Department: " + res[i].DepartmentName + " | " + "Price: " + res[i].Price + " | " + "quantity: " + res[i].StockQuantity);
            console.log("-----------------------------------------------------------------------")
        }
        console.log("   ");
        
        inquirer
        .prompt([{
        	name: "itemId",
            type: "input",
            message: "What is the ID of the product you would like to purchase?",
            validate: function(value) {
            	if (isNaN(value) == false) {
            		return true;
            	} else {
            		return false;
            	}
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "How many units of the product would you like to buy?",
            validate: function(value) {
      	        if (isNaN(value) == false) {
      		        return true;
      	        } else {
      		        return false;
      	        }
            }
        }
        ])
        .then(function(answer) {
        	var inputId = answer.itemId - 1;
    	    var inputProduct = res[inputId];
    	    var inputQuantity = answer.quantity;
    	    if (inputQuantity < inputProduct.StockQuantity) {
    	    	console.log("Your total for " + "(" + answer.quantity + ")" + " - " + res[inputId].ProductName + " is: " + res[inputId].Price.toFixed(2) * inputQuantity);
    	    	connection.query("UPDATE products SET ? WHERE ?", [{
                    StockQuantity: res[inputId].StockQuantity - inputQuantity
                }, {
                    id: res[inputId].id
                }], function(err, res) {
                    runSearch();
                });
    	    } else {
    	    	console.log("Sorry, insufficient Quanity at this time. All we have is " + res[inputId].StockQuantity + " in our Inventory.");
    	    	runSearch();
    	    }
    	});
    });
}