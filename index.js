// const { response } = require("express");
const express = require("express");
const fileUpload =require("express-fileupload");
const pdfParse = require("pdf-parse");
const port = 8383
const app = express();

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/vidhaan",{useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("connectionSuccessful") )
.catch((err) => console.log(err));


app.listen(port, () => console.log(`server has started on port: ${port}`))

app.use("/",express.static("public"));
app.use(fileUpload());

app.post("/extract-text",(req,res) => {
    if(!req.files && !req.files.pdfFile){
        res.status(400);
        res.end();
    }
    pdfParse(req.files.pdfFile).then(result =>{
        res.send(result.text);
    })
});


var post_schema = mongoose.Schema({data : JSON});
var post_model = mongoose.model('collection_name', post_schema);

// var newData = new post_model({data : <json_object>});

// //saving json schema to mongodb         

// newData.save(function(err){
//     if (err) {
//                throw err;
//     }
//     console.log('INSERTED!');
// });


app.use(express.json());
app.post("/",(req,res) => {
    const {parcel} = req.body;
    //console.log(parcel)
    if(!parcel){
        return res.status(400).send({status:"failed"});
    }
    res.status(200).send({status:"received"});

    // for(keys in parcel){
    //     console.log(parcel[keys]);
    // }

    var newData = new post_model({data : parcel});
    console.log(newData);
    newData.save(function(err){
    if (err) {
               throw err;
    }
    console.log('INSERTED!');
    });
})

