const { CAPTCHA_TOKEN, GT4_API_URL } = require("../constants");
var axios = require('axios');
const crypto = require('crypto');

const post_form = async (datas, url) => {
    var options = {
        url: url,
        method: "POST",
        params: datas,
        timeout: 5000
    };

    var result = await axios(options);

    if (result.status != 200) {
        throw new Error('Geetest Response Error')
    }
    return result.data;
}

const hmac_sha256_encode = (value, key) => {
    var hash = crypto.createHmac("sha256", key)
        .update(value, 'utf8')
        .digest('hex');
    return hash;
}

module.exports = {
    validateCaptcha: async (lotNumber, captchaOutput, passToken, genTime) => {
        return new Promise((resolve, reject) => {
            var sign_token = hmac_sha256_encode(lotNumber, CAPTCHA_TOKEN);
            var datas = {
                'lot_number': lotNumber,
                'captcha_output': captchaOutput,
                'pass_token': passToken,
                'gen_time': genTime,
                'sign_token': sign_token
            };

            post_form(datas, GT4_API_URL).then((result) => {

                if (result['result'] == 'success') {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }).catch((err) => {
                reject(err)
            })
        })
    }
}