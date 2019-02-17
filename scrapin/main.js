const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const relais = require('./relais');
const michelin = require('./michelin');
const db = require('./db');


const collectionRelais = "relaisChateaux";
const collection = "relaisChateaux";

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
    res.sendFile

});

app.get('/getRestaurant',(req,res)=>{
    db.getDB().collection(collection).find({}).toArray((err,documents)=>{
       if(err)
       console.log(err);
       else{
           //console.log(documents);
           res.json(documents);
       } 
    })
})

app.put('/:id',(req,res)=>{
    const restaurantId = req.params.id;
    const userInput = req.body;

    db.getDB().collection(collection).findeOne
})

app.get('/filterByName',(req,res)=>{
    db.getDB().collection(collection).aggregate([{$project:{"name":1,"price":1}},{$sort:{"name":1}}]).toArray((err,documents)=>{
        if (err)
        console.log(err);
        else{
            console.log(documents)
            res.json(documents);
        }
    })
})

app.get('/filterByPrice',(req,res)=>{
    db.getDB().collection(collection).aggregate([{$project:{"name":1,"price":1}},{$sort:{"price":1}}]).toArray((err,documents)=>{
        if (err)
        console.log(err);
        else{
            console.log(documents)
            res.json(documents);
        }
    })

})
      
app.use(bodyParser.json());

db.connect((err) => {
    if(err) {
        console.log('unable to connecte to database');
        process.exit(1);
    }
    else {
        app.listen(3000, () => {
            console.log('connected to database, app listening on port 3000');
        });
    }
});


async function insertDataFinalWithComparaison(){
    const dataCastle = await comparaisonRestaurant();
    db.getDB().collection(collection).insertMany(dataCastle, function(err, res) {
        if (err) throw err;
        console.log("document inserted");
    });

}

async function comparaisonRestaurant(){
    let finalResult = [];
    const relaisData = await relais.get();
    const michelinData = await michelin.get();
    for(let i=0 ;i<michelinData.length ; i++){
        const result = relaisData.find(relais => relais.name === michelinData[i].name);
        if(result) finalResult.push(result);
}
return finalResult;
}

async function main(){
    insertDataFinalWithComparaison();
}


main();
