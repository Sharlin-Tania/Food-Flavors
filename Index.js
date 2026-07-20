var mysql2=require("mysql2");

//var dbcon =require("./connection");
var express=require("express");
var nodemailer=require("nodemailer");
var app=express();
var ejs=require('ejs');
const multer = require('multer');
var bodyParser=require("body-parser");
var path=require("path");

var session = require("express-session");
var loggedin={};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


var connection= mysql2.createConnection({
  host:"localhost",
  user:"root",
  password:"*****",
  database:"food"
});



connection.connect(function(error){
  if (error) throw error;
  console.log("Inside Form");
  connection.query("select * from login",function(error,result)
  {if (error) throw error;
    console.log(result);
  })
 })

app.set('view engine','ejs');

app.get('/',function(request,response){
   response.sendFile(__dirname+'/Home.html')
   });
   app.use(express.static(path.join(__dirname,'static')));
   app.use(express.static(__dirname,+'/Images'));

   app.get('/About',function(request,response){
     response.sendFile(__dirname+'/About.html')
   });
   app.get('/FAQ',function(request,response){
     response.sendFile(__dirname+'/FAQ.html')
   });
   app.get('/Signup',function(request,response){
    response.sendFile(__dirname+'/Signup.html')
  });
  app.get('/Loginpage',function(request,response){
    response.sendFile(__dirname+'/Loginpage.html')
  });
  app.get('/hello',function(request,response){
    response.sendFile(__dirname+'/Loginpage.html')
  });

   app.get('/Home1',function(request,response){
     response.sendFile(__dirname+'/Home.html')
   });


app.post('/Signup.html',function(request,response){
  var fname=request.body.firstName;
  var lname=request.body.lastName;
  var username=request.body.username;
  var email=request.body.email;
  var password=request.body.password;
  
  
  connection.connect(function(error) {
      if (error) throw error;
      console.log("connected");
  
        // // // var fname = document.getElementById("firstName");
        // // // var lname = document.getElementById("lastName");
        // var psw = document.getElementById("currentPassword");
        // var uname = document.getElementById("userName");
        // // var email = document.getElementById("inputText");
        
        var sql = "INSERT INTO login (name, password, email) VALUES ('"+username+"','"+password+"','"+email+"')";
        connection.query(sql, function (error, result) {
            if (error) throw error;
            console.log(result.affectedRows + " record(s) updated");
            response.sendFile(__dirname+"/Home1.html")
          });
const transporter = nodemailer.createTransport({
  host:'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'foodflavors141@gmail.com',
    pass: 'iuorzjjdbvdecszg'
            }
          });
          
          // Define email options
          const mailOptions = {
            from: 'foodflavors141@gmail.com',
            to: email,
            subject: "WELCOME TO FOOD&FLAVORS !!!!",
            text: "You have successfully created an account at our website...Enjoy cooking your favourite dish!!!!"
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
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'static')));
app.get('/hello', function(request, response) {
  // Render login template
  response.sendFile(path.join(__dirname + '/Loginpage.html'));
});

app.post('/Loginpage.html', function(request, response) {
  // Capture the input fields
  let email= request.body.email;
  let password = request.body.password;
  // Ensure the input fields exists and are not empty
  if (email && password) {
      // Execute SQL query that'll select the account from the database based on the specified username and password
      connection.query('SELECT * FROM login WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
          // If there is an issue with the query, output the error
          if (error) throw error;
          // If the account exists
          console.log("After select")
          console.log(results);
          if (results.length > 0) {
              // Authenticate the user
              console.log("Inside session")
                 request.session.loggedin = true || {};
                 request.session.email = email;
              // Redirect to home page
                 response.redirect('/Home1.html');
                 //response.redirect(__dirname + "/home.html")
          } else {
              response.send('Incorrect Username and/or Password!');
          }           
          response.end();
      });
  } else {
      response.send('Please enter Username and Password!');
      response.end();
  }
});


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'foodflavors141@gmail.com', // Your Gmail email address
      pass: 'iuorzjjdbvdecszg'   // Your Gmail email password
  }
});

const db = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '*****',
  database: 'food'
});

db.connect((err) => {
  if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
  }
  console.log('Connected to MySQL');
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Destination folder
  },
  filename: (req, file, cb) => {
      const fileName = Date.now() + path.extname(file.originalname);
      cb(null, fileName);
  }
});
const upload = multer({ storage });

// Serve HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Upload.html');
});

// Handle video upload
app.post('/upload', upload.single('video'), (req, res) => {
    const videoPath = req.file.path;

    // Save video metadata to MySQL
    const videoData = {
        title: req.file.originalname,
        path: videoPath
    };

    db.query('INSERT INTO videos SET ?', videoData, (err, result) => {
        if (err) {
            console.error('Error saving video to MySQL:', err);
            res.status(500).send('Error saving video to database.');
            return;
        }

        console.log('Video uploaded successfully to MySQL');
        // res.send('Video uploaded successfully!');

        db.query('SELECT email FROM login', async (emailFetchError, emailRows) => {
            if (emailFetchError) {
                console.error('Error fetching emails from MySQL:', emailFetchError);
                res.status(500).send('Error fetching emails from the database.');
                return;
            }
        const recipientEmails = emailRows.map(row => row.email);
        const mailOptions = {
            from: 'foodflavors141@gmail.com', // Your Gmail email address
            to: recipientEmails.join(','), // Concatenate email addresses with commas
            subject: 'Video Upload Notification',
            text: 'The video has been successfully uploaded.'
        };
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email notification sent successfully.');
        } catch (emailError) {
            console.error('Error sending email notification:', emailError);
        }

        res.sendFile(__dirname+"/Upload1.html")
        }); 

    });
});


// app.get('/delete-event',function(request,response){
//   con.connect(function(error){
//     if(error) throw error;
//     var id=request.query.id;
//     var sql='delete from eventdetails where id=?'
//     con.query (sql[id],function(error,result){
//       if (error) throw error;
//       var sql1="select * from eventdetails";
//       con. query(sql1,function(error,result){
//         if(error) throw error;
//         response.render("event",{title:"student information", action:"list",event:result});
//       });
//     });
//   });
// });


app.listen(8000);