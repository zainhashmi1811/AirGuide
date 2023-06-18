const nodemailer = require('nodemailer'); 
  
let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "b02ab1e8406a6a",
        pass: "201a3bb4e49a11"
    }
})

transporter.verify((err, succ) => {
    if (err) {
        console.log("transporter error " + err)
    }
    else {
        console.log("Nodemailer is ready")
    }
})

const sendVerificationEmail = ({ email, name, otp }, res) => {
    const mailOptions = {
        from: 'zainhashmi8910@gmail.com',
        to: email,
        subject: 'Verify Your Account Through One Time Password',
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
         <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Coupon App User Verification</a>
         </div>
         <p style="font-size:1.1em">Hi, ${name ? name : "User"}</p>
         <p>Thank you for choosing Our Brand. Use the following OTP to complete your Sign Up procedures.</p>
         <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
          <p style="font-size:0.9em;">Regards,<br />Coupon App</p>
         <hr style="border:none;border-top:1px solid #eee" />
         <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          </div>
      </div>
     </div>`,
    }
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
}

module.exports = { sendVerificationEmail } 
