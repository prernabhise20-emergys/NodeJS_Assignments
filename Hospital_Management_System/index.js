import express from 'express'
import dotenv from 'dotenv';
import userRoutes from './src/routes/userRoutes.js';
import patientRoutes from './src/routes/patientRoutes.js';
import cors from 'cors'
import helmet from 'helmet';
dotenv.config();

const {
  env: { PORT },
} = process;

const app = express();
app.use(helmet());
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/api/user", userRoutes);
app.use("/api/patient", patientRoutes);

const corsOptions = {
  origin: "*",
  methods: "GET, POST, PUT,PATCH, DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

