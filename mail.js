var mysql2=require("mysql2");

//var dbcon =require("./connection");
var express=require("express");
var nodemailer=require("nodemailer");
var app=express();
var ejs=require('ejs');
var bodyParser=require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var connection= mysql2.createConnection({
  host:"localhost",
  user:"root",
  password:"mysql",
  database:"22csc38"
});



connection.connect(function(error){
  if (error) throw error;
  console.log("Inside Form");
  connection.query("select * from signup",function(error,result)
  {if (error) throw error;
    console.log(result);
  })
})

//app.set('view engine','ejs');

app.get('/',function(request,response){
  response.sendFile(__dirname+'/Signup.html')
});


app.post('/',function(request,response){
  var name=request.body.name;
  var user_name=request.body.user_name;
  var email=request.body.email;
  var password=request.body.password;
 
  
  
  connection.connect(function(error) {
      if (error) throw error;
      console.log("connected");
  
        // var fname = document.getElementById("firstName");
        // var lname = document.getElementById("lastName");
        // var psw = document.getElementById("currentPassword");
        // var uname = document.getElementById("userName");
        // var email = document.getElementById("inputText");
        
        var sql = "INSERT INTO Signup (name, user_name, email, password) VALUES ('"+name+ "','"+user_name+"','"+email+"', '"+password+"')";
        connection.query(sql, function (error, result) {
            if (error) throw error;
            console.log(result.affectedRows + " record(s) updated");
            response.sendFile(__dirname+ "/Signup.html")
          });

          // Create a transporter object using SMTP details
const transporter = nodemailer.createTransport({
  host:'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'hpgreenplates@gmail.com',
    pass: 'azugcmmqsfmuptxi'
  }
});

// Define email options
const mailOptions = {
  from: 'hpgreenplates@gmail.com',
  to: email,
  subject: "THANK YOU for registering in our HP Greenlife Plates company",
  text: "You have successfully created an account at our website...Enjoy shopping at our store"
};


// Send the email
transporter.sendMail(mailOptions,function(error,info){
if(error)
console.log(error)
else
console.log('Email sent:',info);
});


});
      
});
        


app.listen(8000);