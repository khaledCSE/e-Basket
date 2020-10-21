const ejs = require('ejs');
const nodemailer = require('nodemailer');

const verifyCodeGenerator = (len, arr) => {
    var ans = '';
    for (var i = len; i > 0; i--) {
        ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
};

const outGoingMail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'ebasketshop.20@gmail.com',
            pass: 'e-Basket_2020',
        },
        // service: 'Yahoo',
        // host: 'smtp.mail.yahoo.com',
        // port: 587,
        // auth: {
        //     user: 'ebasketshop@yahoo.com',
        //     pass: 'e-Basket_2020',
        // },
    });
    const data = await ejs.renderFile(options.renderOptions.templatePath, {
        purpose: options.renderOptions.purpose,
        bigMSG: options.renderOptions.bigMSG,
        orderID: options.renderOptions.orderID,
        verification: options.renderOptions.verification,
        msg: options.renderOptions.msg,
    });
    const mailOptions = {
        from: 'ebasketshop.20@gmail.com',
        to: options.to,
        subject: options.subject,
        html: data,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(info);
};

module.exports = {
    outGoingMail: outGoingMail,
    verifyCodeGenerator: verifyCodeGenerator,
};
