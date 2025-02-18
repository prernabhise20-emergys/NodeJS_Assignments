const express=require('express');
require('dotenv').config();

const app=express();
app.use(express.json());

const taskRouter=require('./src/routes/taskRoute');

app.use('/',taskRouter);

app.listen(`${process.env.PORT}`);
