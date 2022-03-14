const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { Schema } = mongoose;
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const reader = require('xlsx')
const cors = require('cors')
const _ = require('lodash');
//bodyParser boiler Plate

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: '*'
}));
const saltRounds = 10;

// Reading our test file
const courseFile = reader.readFile('CollageFinal.xlsx')
const nirfFile2019 = reader.readFile('nirf_2019.xlsx')
const nirfFile2020 = reader.readFile('nirf_2020.xlsx')
const nirfFile2021 = reader.readFile('nirf_2021.xlsx')
const aictcFile2016 = reader.readFile('aictc_2016.xlsx')

let courseData = []
let nirfData2019 = []
let nirfData2020 = []
let nirfData2021 = []
let aictcData2016 = []

const courseSheets = courseFile.SheetNames;
const nirfSheets2019 = nirfFile2019.SheetNames;
const nirfSheets2020 = nirfFile2020.SheetNames;
const nirfSheets2021 = nirfFile2021.SheetNames;
const aictcSheets2016 = aictcFile2016.SheetNames;

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

nirfSchema = new Schema(
  {
  InstituteID : String ,
  Name : String ,
  City : String ,
  State : String ,
  Score : String ,
  Rank : String ,
  year : String
 }
);

const NirfScore = mongoose.model('NirfScore',nirfSchema);

aictc2016Schema = new Schema(
  {
  InstitutePermanentID : String ,
  InstituteName : String ,
  State : String ,
  District : String ,
  City : String ,
 }
);

const Aict2016Record = mongoose.model('Aict2016Record',aictc2016Schema);

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

app.get('/extractcoursedata',(req,res) => {
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

// Course.insertMany(data).then(function(){
//     console.log("Data inserted") ; // Success
//     res.redirect('/');
// }).catch(function(error){
//     console.log(error)      // Failure
// });


});

app.get('/extractnirfdata',(req,res) => {
  for(let i = 0; i < nirfSheets2021.length; i++)
{
   const temp = reader.utils.sheet_to_json(
        nirfFile2021.Sheets[nirfFile2021.SheetNames[i]])
   temp.forEach((res) => {
      res.year = '2021';
      nirfData2021.push(res)
   })
}

// NirfScore.insertMany(nirfData2021).then(function(){
//     console.log("Data inserted") ; // Success
//     res.redirect('/');
// }).catch(function(error){
//     console.log(error)      // Failure
// });


});

app.get('/extractaictcdata',(req,res) => {
  for(let i = 0; i < aictcSheets2016.length; i++)
{
   const temp = reader.utils.sheet_to_json(
        aictcFile2016.Sheets[aictcFile2016.SheetNames[i]])
   temp.forEach((res) => {
      aictcData2016.push(res)
   })
}

// Aict2016Record.insertMany(aictcData2016).then(function(){
//     console.log("Data inserted") ; // Success
//     res.redirect('/');
// }).catch(function(error){
//     console.log(error)      // Failure
// });


});
//nirf scores


app.get('/nirfbycityname/:name',(req,res) =>{

  NirfScore.find({City : _.capitalize(req.params.name)} , function(err , docs){
    if(!err){
      if(docs){
        res.send(docs);
      }
    }
    else{
      console.log(err);
    }
  });
});

app.get('/nirfbystatename/:name',(req,res) =>{

  NirfScore.find({State : _.capitalize(req.params.name)} , function(err , docs){
    if(!err){
      if(docs){
        res.send(docs);
      }
    }
    else{
      console.log(err);
    }
  });
});

app.get('/nirfbyscoremte/:score',(req,res) =>{

  let objects = [];
  NirfScore.find(function(err , docs){
    if(!err){
      if(docs){
        docs.forEach((doc) => {
          if(parseFloat(doc.Score) >= parseFloat(req.params.score)){
            objects.push(doc);
          }
        });
        res.send(objects);
      }
    }
    else{
      console.log(err);
    }
  });
});

app.get('/nirfbyranklte/:rank',(req,res) =>{

  let objects = [];
  NirfScore.find(function(err , docs){
    if(!err){
      if(docs){
        docs.forEach((doc) => {
          if(parseInt(doc.Rank) <= parseInt(req.params.rank)){
            objects.push(doc);
          }
        });
        res.send(objects);
      }
    }
    else{
      console.log(err);
    }
  });
});

app.get('/nirfbyyear/:year',(req,res) =>{

  NirfScore.find({year : req.params.year} , function(err , docs){
    if(!err){
      if(docs){
        res.send(docs);
      }
    }
    else{
      console.log(err);
    }
  });
});


//aictc_2016 accreted colleges
app.get('/aitcclgbystate/:state',(req,res) =>{

  Aict2016Record.find({State : _.capitalize(req.params.state)} , function(err , docs){
    if(!err){
      if(docs){
        res.send(docs);
      }
    }
    else{
      console.log(err);
    }
  });
});

app.get('/aitcclgbydist/:dist',(req,res) =>{

  Aict2016Record.find({District : _.toUpper(req.params.dist)} , function(err , docs){
    if(!err){
      if(docs){
        res.send(docs);
      }
    }
    else{
      console.log(err);
    }
  });
});

app.get('/aitcclgbystate/:city',(req,res) =>{

  Aict2016Record.find({City : _.toUpper(req.params.city)} , function(err , docs){
    if(!err){
      if(docs){
        res.send(docs);
      }
    }
    else{
      console.log(err);
    }
  });
});

app.get('/aictcclg',(req,res) =>{

  Aict2016Record.find( function(err , docs){
    if(!err){
      if(docs){
        res.send(docs);
      }
    }
    else{
      console.log(err);
    }
  });
});



//courses
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
  let courseName = _.capitalize(req.params.name);

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

//users
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
