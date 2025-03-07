import express from 'express'
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import appRoutes from './src/app/app.js';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connecté à la base de données!'))
    .catch(err => console.error('Erreur de connexion à la base de données:', err));

app.get('/', (req, res) => {
    res.send('Bonjour!');
});

app.use(appRoutes);

app.listen(port, () => {
    console.log(`Serveur écoutant sur le port ${port}`);
});
