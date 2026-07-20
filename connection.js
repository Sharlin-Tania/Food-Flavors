var mysql2=require("mysql2");

//create a connection
var connection= mysql2.createConnection({
    host:"localhost",
    user:"root",
    password:"*****",
    database:"food"
});


connection.connect(function(error){
    if(error) throw error;
    console.log("Database connected")
    // var sql="select * from accounts";
    // connection.query(sql,function(error,result){
    //     if(error) throw error;
    //     console.log("success")
    //     console.log(result)
    // });
});