const express = require('express')
const axios = require('axios');
const app = express()
const mongoose = require('mongoose')
const { Schema } = mongoose;
const bodyParser = require('body-parser')
const cors = require('cors')
const _ = require('lodash');
const { log } = require('console');
const { userInfo } = require('os');
//bodyParser boiler Plate

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: '*'
}));



//connection

mongoose.connect('mongodb+srv://hexClan:acpprs@cluster0.ywe7a.mongodb.net/hackathon22?retryWrites=true&w=majority')

//schema creation

mongoSchema = new Schema(
  {
  name : String ,
  state_province : String
 }
);


 const Course = mongoose.model('Course',mongoSchema);


app.get('/', (req, res) => {
  res.send('<p>For Accessing List of universities go to /unis </p> ');
 
});

app.get('/unis',(req , response) => {
  const objectList = [];
  axios
  .get('http://universities.hipolabs.com/search?country=India')
  .then(res => {
     let objectList = [];
     Course.deleteMany({}, function(error){
       if(error) {
         response.send('something went wrong')
       }else{
        res.data.forEach(jsonObject => {
          
          const course = {
             name : jsonObject['name'] ,
             state_province : jsonObject['state-province']
             }     
             objectList.push(course);
       })
         
       Course.insertMany(objectList).then((docs) => {
         response.send(docs);
      }).catch((err) => {
        console.log(err);
      })
       }
     });
    
   })
   .catch(error => {
     response.send(error);
   })
    });
    
    
  app.get('/unis/:state',(req , res) => {

        let finalSet = [];
        //state requested from url
        let stateRequested = _.lowerCase(req.params.state);

        //check state_province field's existence if so then fetch Uni's
        Course.find({} , (err , docs) => {
          if(err){
            res.send(err);
          }
    else{
        docs.forEach(doc => {
       if(doc.state_province != null &&_.lowerCase(doc.state_province).includes(stateRequested)){
        finalSet.push(doc);
       }
       else if(_.lowerCase(doc.name).includes(stateRequested))
       finalSet.push(doc);
      });
      //return list of unis acc. to state
      res.send(finalSet); 
    }
  })
});






let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, () => {
  console.log(`Node app listening on port ${port}`)
})
