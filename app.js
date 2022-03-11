const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { Schema } = mongoose;
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const reader = require('xlsx')
const cors = require('cors')

//bodyParser boiler Plate

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: '*'
}));
const saltRounds = 10;

// Reading our test file
const file = reader.readFile('CollageFinal.xlsx')

let data = []

const sheets = file.SheetNames

//connection

mongoose.connect('mongodb+srv://hexClan:acpprs@cluster0.ywe7a.mongodb.net/hackathon22?retryWrites=true&w=majority')

//schema creation

mongoSchema = new Schema(
  {
  name : String ,
  college_available : String ,
  degree : String ,
  link : String
 }
);

const Course = mongoose.model('Course',mongoSchema);

userSchema = new Schema({
  name : String ,
  password : String ,
  email : String ,
  phoneNo : String
});

const User = mongoose.model('User',userSchema);


app.get('/', (req, res) => {
  res.send('Hello World!')
  // const commManag = Course(
  //   {
  //     name : 'Communication Management' ,
  //     college_available : 1 ,
  //     degree : 'M.B.A' ,
  //     link : 'https://bschool.careers360.com/colleges/list-of-mba-colleges-in-india'
  //   }
  // );
  //
  // commManag.save();
})

app.get('/extractdata',(req,res) => {
  for(let i = 0; i < sheets.length; i++)
{
   const temp = reader.utils.sheet_to_json(
        file.Sheets[file.SheetNames[i]])
   temp.forEach((res) => {
      data.push(res)
   })
}

// Printing data
//console.log(data);
for(let i = 0 ; i < data.length ; i++){
  if(data[i].college_available)
  data[i].college_available = data[i].college_available.substr(19);
}

Course.insertMany(data).then(function(){
    console.log("Data inserted") ; // Success
    res.redirect('/');
}).catch(function(error){
    console.log(error)      // Failure
});


});

app.get('/getall',(req,res) =>{

  Course.find({name : {$exists : true}} , function(err , docs){
    if(!err){
      if(docs){
        res.send(docs);
      }
    }
    else{
      console.log(err);
    }
  });

})

app.get('/getbyname/:name',(req,res) => {
  let courseName = req.params.name;

  //console.log(courseName);

  Course.find({name : courseName }, function(err , docs){
    if(!err){
      if(docs){
        res.send(docs);
      }
    }
    else{
      console.log(err);
    }
  });

})

app.post('/signup',(req ,res) => {
  if(req.body.name){
  // to hash passwword
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
     // Store hash in your password DB.
     if(!err){
       const newUser = new User({
           name : req.body.name ,
           password : hash ,
           email : req.body.email ,
           phoneNo : req.body.phoneNo
         });

         newUser.save(function(err,result){
           if(err){
             res.send('err');
           }
           else{
             res.send('ok');
           }
         });
     }
     else{
       res.send('err');
     }
  });

  }
  else{
    res.send('err');
  }
})

app.post('/signin',(req,res) =>{
  if(req.body.email){
 let email = req.body.email ;
 let plainPass = req.body.password;


  User.findOne({email : email} , function(err , user){
    //for comparing password
    if(user){

    bcrypt.compare(plainPass, user.password, function(err, result) {
        res.send(result);
    });
    
  }
  else{
    res.send(false);
  }
  });


}
else{
  res.send(false);
}

});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, () => {
  console.log(`Node app listening on port ${port}`)
})
