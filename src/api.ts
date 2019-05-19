import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { router as productRouter } from './routes/product';
import { router as userRouter } from './routes/user';
import { router as loginRouter } from './routes/login';

const app = express(),
  PORT = 6969,
  corsOptions = {
    origin: 'http://localhost:4200',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 200
  },
  router = express.Router();

router.use(bodyParser.json());
router.use(cors(corsOptions));

app.use(router);
app.use(productRouter);
app.use(userRouter);
app.use(loginRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
