require('dotenv').config();
const express = require('express')
const app=express();
const PORT=5000||process.env.PORT
const MongoStore = require('connect-mongo');
const cookieParser=require('cookie-parser')
const connectDB=require('./server/config/db')
const expressLayout = require('express-ejs-layouts');
const session = require('express-session');
app.use(express.static('public'))
app.use(expressLayout)
app.use(express.urlencoded({extended:true}))
app.use(express.json())
connectDB();
app.set('layout','./layout/main')
app.set('view engine','ejs');
app.use('/',require('./server/routes/main'))
app.use('',require('./server/routes/admin'))
app.use(cookieParser());
app.use(session({
  secret:'Keyboard-cat',
  resave:false,
  saveUninitialized:true,
store: MongoStore.create({
    mongoUrl:process.env.URL
})
}))
app.listen(PORT,()=>{
    console.log(`Well come to Post: ${PORT} `);
})