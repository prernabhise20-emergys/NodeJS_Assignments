import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();
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

export default connection;
