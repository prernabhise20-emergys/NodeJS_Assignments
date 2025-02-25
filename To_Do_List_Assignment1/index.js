const express=require('express');
require('dotenv').config();
const{env}=process;
const {PORT}=env;

const app=express();
app.use(express.json());

const taskRouter=require('./src/routes/taskRoute');
const userRoute=require('./src/routes/userRoute');

app.use('/task',taskRouter);
app.use('/user',userRoute);

app.listen(PORT);
