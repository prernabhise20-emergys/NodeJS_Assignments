const express = require('express');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');

const { env: { PORT } } = process;

const app = express();
app.use(helmet());

const corsOptions = {
    origin: 'http://localhost:5000', 
    methods: 'GET, POST, PUT,PATCH, DELETE', 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true 
};

app.use(cors(corsOptions)); 
app.use(express.json());

const taskRouter = require('./src/routes/taskRoute');
const userRoute = require('./src/routes/userRoute');

app.use('/api/task', taskRouter);
app.use('/api/user', userRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




