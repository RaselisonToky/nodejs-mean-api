import express from 'express';
import userRoutes from '../../src/user/user.route.js';
import carBrandRoute from "../car/brand/brand.route.js";
import modelBrandRoute from "../car/model/model.route.js";
import serviceRoute from "../service/service.route.js";
import categoryRoute from "../category/category.route.js";

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('ok');
});


app.use('/users', userRoutes);
app.use('/brand', carBrandRoute);
app.use('/model', modelBrandRoute);
app.use('/service', serviceRoute);
app.user('/category', categoryRoute);

export default app;
