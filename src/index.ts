import dotenv from 'dotenv';
import express from 'express';


dotenv.config();
const app = express();


const PORT = process.env.PORT || 6969;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`)
})