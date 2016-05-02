var logger = require('../libs/log')(module);
var nodeMailer = require('nodemailer');
var transporter = nodeMailer.createTransport(process.env.SMTPS_SERVER);

module.exports = function Mailer() {
    this.send = function (email, title, message) {

        var mailOptions = {
            from: 'FreeshGame <freeshgame.pp.ua>',
            to: email,
            subject: title,
            html: message
        };

        transporter.sendMail(mailOptions, function(err, info){
            if(err){
                return logger.error(err);
            }

            logger.info(info);
        });
    }
};