const express = require("express");
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const teapotRouter = require('./routers/teapot');
const captchaRouter = require('./routers/captcha');

const app = express();

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'captcha-provider',
      version: '1.0.0',
    },
  },
  apis: ['./routers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', (req, res) => {
  res.set('Content-Type', 'application/json').send(swaggerSpec);
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

app.use(cors());

app.use(express.static("public"));

app.use('/captcha', captchaRouter);
app.use('/teapot', teapotRouter);

const PORT = process.env.PORT || 8000;

const listener = app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
