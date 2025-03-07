import express from 'express';
import userRoutes from '../../src/user/user.route.js';

const app = express();
app.use(express.json());

app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send('ok');
});
export default app;
