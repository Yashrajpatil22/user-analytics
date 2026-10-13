import express from 'express';
import connectDB from './db/index.js';
import eventRoutes from './routes/Event.route.js';
import sessionRoutes from './routes/Session.route.js';
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use(express.json());
app.use('/api/events', eventRoutes);
app.use('/api/sessions', sessionRoutes);

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

