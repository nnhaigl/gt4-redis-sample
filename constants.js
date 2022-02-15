const CAPTCHA_ID = "54088bb07d2df3c46b79f80300b0abbe";
const API_SERVER = "http://gcaptcha4.geetest.com"
module.exports = {
    CAPTCHA_ID: CAPTCHA_ID,
    CAPTCHA_TOKEN: "d23bf3f2507ec46e6abd6aadc4e320bb",
    GT4_API_SERVER: API_SERVER,
    GT4_API_URL: `${API_SERVER}/validate?captcha_id=${CAPTCHA_ID}`
}