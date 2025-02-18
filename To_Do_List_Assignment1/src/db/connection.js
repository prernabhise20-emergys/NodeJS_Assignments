const mysql=require('mysql')
require('dotenv').config();

const connection=mysql.createConnection({
port:process.env.DB_PORT,
host:process.env.DB_HOST,
user:process.env.DB_USER,
password:process.env.DB_PASSWORD,
database:process.env.DATABASE
});


 
connection.connect((error)=>{
    if(error){
        console.log(error)
        console.log('error');
        
    }
    else{
        console.log('database connected')
    }
})

module.exports=connection;


// TaskModel.getTasks()
        // .then(tasks => {
        //     res.status(200).json(tasks);  
        // })
        // .catch(error => {
        //     console.log('Error:', error);
        //    return res.status(500).send({ message: "Internal Server Error" });
        // });