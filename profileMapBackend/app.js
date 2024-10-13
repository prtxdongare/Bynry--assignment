import express from 'express';
import cors from 'cors';
const app = express();

import router from './routes/user.route.js';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

export default app;