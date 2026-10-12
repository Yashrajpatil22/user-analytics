import express from 'express';
import connectDB from './db/index.js';
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

connectDB()
  .then(
    () => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    
  )
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

