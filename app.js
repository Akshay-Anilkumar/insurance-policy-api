const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');    
const routes = require('./routes/policy.route');
const { errorHandler, notFound } = require('./middlewares/error.middleware');

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));
