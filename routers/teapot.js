const router = require("express").Router();

/**
 * @openapi
 * 
 * /teapot:
 *   get:
 *     tags:
 *       - teapot
 *     summary: >
 *       I'm a teapot
 *       (HTCPCP)
 *     produces:
 *       - text/plain
 *     responses:
 *       '418':
 *         description: I'm a teapot
 */
router.get('/', (req, res) => {
  res.sendStatus(418);
})

module.exports = router;
