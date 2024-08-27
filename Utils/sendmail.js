const nodemailer = require('nodemailer');
const assert = require('assert');

const send_mail = async( {host, port, secure=false, user, pass, from, to, subject, text, attachments_file, attachments_path, html} ) => {
    try {
        const transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user,
                pass
            }
        });
        const info = await transporter.sendMail({
            from,
            to,
            subject,
            text,
            html,
            // attachments:[{
            //     filename: attachments_file,
            //     path: attachments_path
            // }]
        });
        return info;
    } catch (error) {
        throw error
    }
}
module.exports = send_mail;