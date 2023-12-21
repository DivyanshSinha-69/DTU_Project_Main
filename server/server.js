const express=require("express")
const cors=require("cors");
const app=express();


app.get('/route',(req,res)=>{
    res.send("hello world");
})
app.listen(3000,()=>{
    console.log("server started");
});