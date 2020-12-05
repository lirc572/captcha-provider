const router = require("express").Router();
const captcha = require('../utils/captcha');

router.get('/', async (req, res) => {
  // type is text by default
  const cid = await captcha.generate({ type: req.query.type || 'text' });
  if (cid) {
    res.json({ cid });
    return;
  }
  res.sendStatus(406);
})

router.get('/:cid', async (req, res) => {
  const cap = await captcha.get(req.params.cid);
  if (cap) {
    res
      .set({'Content-Type': 'image/svg+xml'})
      .send(cap);
    return;
  }
  res.sendStatus(404);
})

router.post('/:cid', async (req, res) => {
  const validated = await captcha.validate(req.params.cid, req.body.text);
  if (validated) {
    res.sendStatus(204);
  } else if (validated === undefined) {
    res.sendStatus(404);
  } else {
    res.sendStatus(418);
  }
})

module.exports = router;
