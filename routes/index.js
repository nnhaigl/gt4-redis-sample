var express = require('express');
var querystring = require('querystring');
var router = express.Router();
const redisUtil = require("../utils/redis.helper");
const { validateCaptcha } = require("../utils/gt4.helper")


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/attack', express.json(), async function (req, res, next) {
  const { gameId, lot_number, captcha_output, pass_token, gen_time } = req.body;
  const { userid } = req.headers;
  //check gameid in redis cache
  let currentValue = await redisUtil.getValue(`game${gameId}`);
  if (currentValue && currentValue === userid) {
    return res.status(200).send({
      result: "success"
    })
  }
  else if (currentValue && currentValue !== userid) {
    return res.status(200).send({
      result: "fail",
      message: "Game has been attacked"
    })
  }

  const isValidate = await validateCaptcha(lot_number, captcha_output, pass_token, gen_time);
  if (!isValidate) {
    return res.status(200).send({
      result: "fail",
      message: "Captcha validate fail"
    })
  }
  await redisUtil.setValue(`game${gameId}`, userid);
  currentValue = await redisUtil.getValue(`game${gameId}`);
  if (currentValue !== userid) {
    res.status(200).send({
      result: "fail",
      message: "Game has been attacked"
    })
  }
  else {
    res.status(200).send({
      result: "success"
    })
  }
});
module.exports = router;
