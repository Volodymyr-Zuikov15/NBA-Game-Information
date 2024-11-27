import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import models, { connectDb } from './models';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/player', routes.player);

connectDb().then(async () => {
  app.listen(process.env.PORT, '0.0.0.0',  () =>
    console.log(`NBA App listening on port ${process.env.PORT}!`),
  );
});
