const router = require("express").Router();

router.get('/', (req, res) => {
  res.sendStatus(418);
})

module.exports = router;
