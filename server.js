const express =require('express');
const mongoose = require('mongoose');
const TaskSchema =require("./model.js");
const app =express();
const dotenv =require('dotenv');
const path=require('path')

dotenv.config();
const DB=process.env.DATABASE;
const cors = require('cors');



app.use(express.json())

app.use(express.static(path.join(__dirname,"./client/build")));

app.get("*",function(req,res){
    res.sendFile(path.join(__dirname,"./client/build/index.html"));
});

app.use(cors({
    origin:'*'
}))

mongoose.connect(DB,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>console.log("Db connected.."))

app.post('/addtask',async (req,res)=>{

    const {todo}= req.body;

    try{

        const newData = new TaskSchema({
            todo : todo
        });

        await newData.save();
        return res.json(await TaskSchema.find())
    }
    catch(err){
        console.log(err.message)
    }
})

app.get('/gettask',async(req,res)=>{
    try{

      return res.json(await TaskSchema.find());

    }
    catch(err)
    {
        console.log(err.message)
    }
})

app.delete('/deletetask/:id',async (req,res)=>{

    try{

        await TaskSchema.findByIdAndDelete(req.params.id)
        return res.json(await TaskSchema.find())

    }catch(err){
        console.log(err.message)
    }
})


app.listen(process.env.PORT,()=>console.log("run"));