let express = require('express');
let app = express();
let cors = require('cors');
let dotenv = require('dotenv');
dotenv.config();
let port = process.env.PORT || 9123;
let mongo = require('mongodb');
let MongoClient =mongo.MongoClient;
let bodyParser = require('body-parser');
let mongourl = "mongodb+srv://test:test1234@cluster0.o8n1cjg.mongodb.net/test";
let db;

app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.get('/',(req,res) => {
    res.send('hii from express');
})

app.get('/product',(req,res) => {
    db.collection('product').find().toArray((err,data) => {
        if(err) throw err;
        res.send(data)
    })
})

app.get('/productList',(req,res) => {
    db.collection('productList').find().toArray((err,data) => {
        if(err) throw err;
        res.send(data)
    })
})

app.get('/grades',(req,res) => {
    db.collection('grades').find().toArray((err,data) => {
        if(err) throw err;
        res.send(data)
    })
})

//get all topics
app.get('/topic',(req,res) => {
    db.collection('topic').find().toArray((err,data) => {
        if(err) throw err;
        res.send(data)
    })
})

app.get('/textbook',(req,res) => {
    db.collection('textbook').find().toArray((err,data) => {
        if(err) throw err;
        res.send(data)
    })
})
 app.get('/tbDetails',(req,res) => {
    db.collection('tbDetails').find().toArray((err,data) => {
       if(err) throw err;
        res.send(data)
    })
})
app.get('/orders',(req,res) => {
    db.collection('orders').find().toArray((err,data) => {
       if(err) throw err;
        res.send(data)
    })
})

//all details
app.get('/details',(req,res) => {
    db.collection('details').find().toArray((err,data) => {
        if(err) throw err;
        res.send(data)
    })
})

//textbook wrt subject
app.get('/textbook/:id', (req,res) => {
    
    let query={};
    
    
    let subjId = Number(req.params.id);
    if(subjId) {
        query = {
                   
                    "subjects_id":subjId
                }
    }else{
        query = {
           
        }
    }
    
    db.collection('textbook').find(query).toArray((err,data) => {
        if(err) throw err;
        res.send(data)
    })
})


app.get('/textbook', (req,res) => {
    
    let query={};
    let curriculumId = Number(req.query.curriculumId);
    let subjectsId = Number(req.query.subId);
    
    if(subjectsId) {
        query = {
                    
                    "subjects_id":subjectsId
                }
    }else if(curriculumId) {
        query = {
            "curriculum_id":curId
        }
    }else{
        query={}
    }
       
    
    
    db.collection('textbook').find(query).toArray((err,data) => {
        if(err) throw err;
        res.send(data)
    })
})

//details wrt. grades
app.get('/details/:id',(req,res) => {
    console.log(req.params.id)
    let grades_id = Number(req.params.id)
    db.collection('details').find({"grades.grades_id":grades_id}).toArray((err,data) => {
        if(err) throw err;
        res.send(data)
    })
})

//topic wrt schoolLevel
app.get('/topic/:schId',(req,res) => {
    console.log(req.params.schId)
    let sch_id = Number(req.params.schId)
    db.collection('topic').find({schoolLevel_id:sch_id},{topic_name:1}).toArray((err,data) => {
        if(err) throw err;
        res.send(data)
    })                                                                           
})

//textbook wrt curriculum id
app.get('/tb/:curId',(req,res) => {
    console.log(req.params.curId)
    let curriculum_id = Number(req.params.curId)
    db.collection('textbook').find({curriculum_id}).toArray((err,data) => {
        if(err) throw err;
        res.send(data)
    })
})

//filter out on

app.get('/doc/:gId', (req,res) => {
    let gId = Number(req.query.gId);
    let subId = Number(req.params.subId);
    let query = {};

    if(gId){
        query={
            subjects_id:subId,
            grades_id:gId
        }
    }else{
        query = {
            subjects_id:subId
        }
    }
    db.collection('topic').find(query).toArray((err,data) => {
        if(err) throw err;
        res.send(data)
    })
})




//orders (gizmos) wrt EMail
app.get('orders',(req,res)=>{
    let query ={};
    let email = req.query.email;
    if(email){
        query = {email}
    }
    db.collection('orders').find(query).toArray((err,data) => {
        if(err) throw err;
        res.send(data)
    })
})

//place order
app.post('/placeOrder',(req,res) => {
    db.collection('orders').insert(req.body, (err,data) => {
        if(err) throw err;
        res.send('order Placed')
    })
})

//update order
app.put('/updateOrder/:id', (req,res) =>{
    let oid = Number(req.params.id);
    db.collection('orders').updateOne(  {order_id:oid},
        {
            $set:{
                "status": req.body.status,
                "bank_name":req.body.bank_name,
                "date":req.body.date
            }
        },(err,result) => {
                if(err) throw err;
                res.send('order updated')
            }
    )
})

//delete order
app.delete('/deleteOrder/:id',(req,res) =>{
    let _id = mongo.ObjectId(req.params.id);
    db.collection('orders').remove({_id},(err,result) => {
        if(err) throw err;
        res.send('order deleted')
    })
})

//details list after place order
app.post('/detailsList',(req,res) => {
    if(Array.isArray(req.body.id)){
        db.collection('topic').find({topic_id:
        {$in:req.body.id}}).toArray((err,result) =>{
            if(err) throw err;
            res.send(result)
        })
    }else{
        res.send('invalid input')
    }
})

MongoClient.connect(mongourl,(err,client) => {
    if(err) console.log('error while connecting');
    db = client.db('ELdata');
    app.listen(port,(err) => {
    if(err) throw err;
    console.log(`server is running on port ${port}`);
    }) 
})