import express from 'express';
import bodyParser from 'body-parser';
import requestsRouter from './routes/requests';

const app = express();

app.use(bodyParser.json());

app.use('/api', requestsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
