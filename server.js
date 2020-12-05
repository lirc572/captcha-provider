const express = require("express");
const cors = require('cors');

const teapotRouter = require('./routers/teapot');
const captchaRouter = require('./routers/captcha');

const app = express();

app.use(express.json());

app.use(cors());

app.use(express.static("public"));

app.use('/captcha', captchaRouter);
app.use('/teapot', teapotRouter);

const PORT = process.env.PORT || 8000;

const listener = app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
