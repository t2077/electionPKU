//填入www.ttshitu.com的账号密码
const recognizerConfig = {
    username: "你的账号",
    password: "你的密码",
};

window.confirm = function(message) {
    console.log(message);
    return true;
};

function setValidationCode(code) {
    const inputBox = document.querySelector("#validCode");
    inputBox.value = code.slice(0, 5);
}


function getBase64Data() {
    const image = document.querySelector("#imgname");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    ctx.drawImage(image, 0, 0);
    return canvas.toDataURL("image/jpeg").split(",")[1];
}

function recognizeImage() {
    const base64 = getBase64Data();
    fetch("https://api.ttshitu.com/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: recognizerConfig.username,
            password: recognizerConfig.password,
            typeid: "1003",
            image: base64,
        })
    })
    .then(res => res.json())
    .then(response => {
        if (response.success) {
            setValidationCode(response.data.result);
        }
    })
    .catch(e => {});
}

window.alert = function(msg) {
    const text = (msg||"").toString().trim();
    if (text.includes("验证码不正确") || text.includes("验证码错误")) {
        document.querySelector('a[href="javascript:changeValid()"]')?.click();
        setTimeout(recognizeImage, 500);
        return;
    }
    if (text.includes("验证码不能为空")) {
        recognizeImage();
        return;
    }
};




setInterval(() => {
    const tx = [...document.links].filter(a=>(a=a.innerText)&&(f=a.charCodeAt())>1e4&&a.at(-1).charCodeAt()-f==9);;
	if (tx.length) tx[Math.floor(Math.random() * tx.length)].click();
}, 1000);

