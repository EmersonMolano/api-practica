const fs = require("fs");

const products = JSON.parse(fs.readFileSync("Back-end/products.json"));
const users = JSON.parse(fs.readFileSync("Back-end/users.json"));


const db = {
  products: products.products || products,
  users: users.users || users,
};

fs.writeFileSync("db.json", JSON.stringify(db, null, 2));

console.log("db.json creado correctamente");
