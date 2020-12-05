const svgCaptcha = require('svg-captcha');

const Captcha = require('../models/Captcha');

module.exports.generate = async function(options) {
  let captchaObject;
  if (options.type == 'text') {
    captchaObject = svgCaptcha.create();
  } else if (options.type == 'math') {
    captchaObject = svgCaptcha.createMathExpr({
      mathMin: 1,
      mathMax: 9,
      mathOperator: '+-',
    });
  } else {
    return undefined;
  }
  const captcha = await Captcha.create(captchaObject);
  return captcha.id;
}

module.exports.get = async function(cid) {
  const captchas = await Captcha.findAll({
    where: {
      id: cid,
    },
  });
  if (!captchas.length) {
    return undefined;
  }
  return captchas[0].data;
}

module.exports.validate = async function(cid, text) {
  const captchas = await Captcha.findAll({
    where: {
      id: cid,
    },
  });
  if (!captchas.length) {
    return undefined;
  }
  if (captchas[0].text.toLowerCase() === text.toLowerCase()) {
    await Captcha.destroy({
      where: {
        id: cid,
      },
    });
    return true;
  }
  return false;
}
