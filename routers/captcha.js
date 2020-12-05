const router = require("express").Router();
const captcha = require('../utils/captcha');

/**
 * @openapi
 * 
 * /captcha:
 *   get:
 *     tags:
 *       - Captcha
 *     summary: Generate a new captcha
 *     parameters:
 *       - name: type
 *         in: query
 *         required: false
 *         description: "default value: <code>text</code> (if param not provided)"
 *         schema:
 *           type: string
 *           enum: [text, math]
 *           example: text
 *     responses:
 *       '200':
 *         description: >
 *           Sucessful <br/>
 *           Use the returned <code>cid</code> in [/captcha/{cid}](#/Captcha/get_captcha__cid_)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cid:
 *                   type: string
 *                   example: 2f7c3b83-7c5a-4a0a-8d4a-8d762d1fc5af
 *       '406':
 *         description: >
 *           Unsuccessful <br/>
 *           Unlikely to happen, if it happens, just retry
 */
router.get('/', async (req, res) => {
  // type is text by default
  const cid = await captcha.generate({ type: req.query.type || 'text' });
  if (cid) {
    res.json({ cid });
    return;
  }
  res.sendStatus(406);
})

/**
 * @openapi
 * 
 * /captcha/{cid}:
 *   get:
 *     tags:
 *       - Captcha
 *     summary: Get a captcha svg
 *     parameters:
 *       - name: cid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 2f7c3b83-7c5a-4a0a-8d4a-8d762d1fc5af
 *     responses:
 *       '200':
 *         description: Sucessful
 *         content:
 *           image/svg+xml:
 *             schema:
 *               type: object
 *       '404':
 *         description: >
 *           Not found <br/>
 *           Invalid <code>cid</code>
 */
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

/**
 * @openapi
 * 
 * /captcha/{cid}:
 *   post:
 *     tags:
 *       - Captcha
 *     summary: Validate captcha
 *     parameters:
 *       - name: cid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 2f7c3b83-7c5a-4a0a-8d4a-8d762d1fc5af
 *     requestBody:
 *       description: >
 *         <code>text</code> (user input) <br/>
 *         Note that <code>text</code> must be a string even if it is a math captcha
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: "520"
 *     responses:
 *       '204':
 *         description: Sucessful (correct text)
 *       '404':
 *         description: >
 *           Not found <br/>
 *           Invalid <code>cid</code>
 *       '418':
 *         description: >
 *           Unsuccessful (incorrect text)
 */
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
