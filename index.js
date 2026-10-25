const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');
const id = uuidv4();


const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
app.use(express.urlencoded ({ extended : true }));
app.use(methodOverride("_method"));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded ({ extended : true }));

require("dotenv").config();


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


let generandouser = () =>{
    return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
    ];

};



app.get("/",(req,res)=>{
  let q = "SELECT Count(*) AS count FROM user";
      connection.query(q,(err,results)=>{
      if (err) {
        console.log(err);
        res.send("error in db")
      }
      let count = results[0].count;
      console.log(results);
      res.render("home.ejs",{count});
      
}
);
})

app.get("/users",(req,res)=>{
  let q = "SELECT * FROM user";
  connection.query(q,(err,users)=>{
      if (err) {
        console.log(err);
        res.send("error in db")
      }
      res.render("showusers.ejs",{users});
  })
})

app.get("/users/:id/edit",(req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  connection.query(q,(err,results)=>{
      if (err) {
        console.log(err);
        res.send("error in db")
      }
      console.log(results);
      let user = results[0];
      console.log(user);
      res.render("edit.ejs",{user});
  })
});

app.patch("/users/:id/edit",(req,res)=>{
   let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  connection.query(q,(err,results)=>{
      if (err) {
        console.log(err);
        res.send("error in db")
      }
      let user = results[0];
      console.log(results)
      let {password:newPassword,username :newUsername} = req.body;
      if(user.password != newPassword){
        res.send("wrong password!try again!");

      }else{
        console.log("ID:", id);
console.log("New username:", newUsername);
        let q2 = `UPDATE user SET name = ? WHERE id = ?`
        connection.query(q2,[newUsername,id],(err,result)=>{
          if(err){
            console.log(err);
          }
          res.redirect("/users");

        })
      }
  })
})

app.delete("/users/:id", (req, res) => {
    let { id } = req.params;

    let q = "DELETE FROM `user` WHERE id = ?";

    connection.query(q, [id], (err, result) => {
        if (err) throw err;

        console.log("User deleted successfully!");
        res.redirect("/users");
    });
});


app.listen(8080,()=>{
console.log("app is listening on 8080");
})