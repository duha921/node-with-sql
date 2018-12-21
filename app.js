/*
 * NodeJs With MySql Example
 * This is the start file
 * You can change travel name database to your database name
 * Also you can change agencies table name to your tables name
*/

//  Dependencies
const mysql = require('mysql');
const express = require('express');
const app = express();

app.use(express.json());

//  Establishing a connection with the DB host
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "travel",
  port: 8889
});


//  Hasneling the get all data request
app.get('/api/agencies', (req, res) => {
  //  Getting all data from the agencies table
    con.query("SELECT * FROM agencies", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
  });
});


//  Using Where to get a little more complex queries
app.get('/api/agencies/simpleWhere', (req, res) => {
  //  Getting all data from the agencies table
    con.query("SELECT * FROM agencies WHERE name = 'البسفور'", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
  });
});


//  OrderBy time
app.get('/api/agencies/orderBy', (req, res) => {
  //  Getting all data from the agencies table ordered bt the creattion time
  //  created_at is a colmun name, and you can call it without DESC and it will come ordered in asc
    con.query("SELECT * FROM agencies ORDER BY created_at DESC", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
  });
});


//  Delete row from the table
app.delete('/api/agencies/:id', (req, res) => {
    con.query(`DELETE FROM agencies WHERE id = ' ${req.params.id} '`, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
  });
});


//  Update
app.put('/api/agencies/:id', (req, res) => {
    con.query(`UPDATE agencies SET name = '${req.body.name}' WHERE id = ${req.params.id}`, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
  });
});


//  Update
app.get('/api/agencies/limit', (req, res) => {
  //  Getting the limit from the request query
  const limit = req.query;
    con.query(`SELECT * FROM agencies LIMIT ${req.query.limit}`, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
  });
});


//  Join example
app.get('/api/agencies/withJoin', (req, res) => {
  //  Getting the limit from the request query
  const limit = req.query;
    con.query(`SELECT * FROM agencylocations JOIN agencies ON agencylocations.agency_id = agencies.id`, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
  });
});


//  Setting the queries by the end user
//  If you called (http://localhost:3000/api/agencies/complexWhere) it will bring all agencies
//  And if you called (http://localhost:3000/api/agencies/complexWhere?name=flyBaghdad) it will bring all agencies that has that name
/*  Also if you called
    (http://localhost:3000/api/agencies/complexWhere?name=flyBaghdad&location=erbil)
    it will bring all agencies that has that name and located in erbil
*/
app.get('/api/agencies/complexWhere' ,(req, res) => {
  //  Setting a base to be called if the user didn't pass any request query
  let sqlquery = 'SELECT * FROM agencies';
  //  To know if i will put AND or i don't have to
  let i = 1;
  // Getting the length of req.query, i used this way because it's an object not an array
  let numberOfQueries = Object.keys(req.query).length;
  //  Checking if there is any queries passed to the url request
  if(numberOfQueries){
    // Putting WHERE after the sqlquery string so it will be 'SELECT * FROM agencies WHERE '
    sqlquery += ` WHERE `;
    //  Getting the queries if there is more than one
    for ( item in req.query ) {
      //  Adding the queries to the sqlquery string so it will be like "SELECT * FROM agencies WHERE name = 'الاسم' "
      sqlquery += `${ item } = ` + "'" + `${ req.query[item] }` + "'";
      if( numberOfQueries > i) {
        //  Adding AND to the end in case there is another query so sqlquery will be "SELECT * FROM agencies WHERE name = 'الاسم' AND "
        sqlquery += ` AND `;
      }
      i ++ ;
    }
  }
  //  Using the Full query string
  con.query(sqlquery, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
});


app.listen(3000, () => {
  console.log('App Is Running on port 3000');
})
