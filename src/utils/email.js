import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_ID_KEY, // Gmail 계정 이메일 주소
    pass: process.env.SMTP_PW_KEY, // Gmail 계정 비밀번호
  },
});

const sendMail = async (email, emailToken) => {
  const mailOptions = {
    from: "wh@wh.com",
    to: email,
    subject: "이메일 인증을 완료해주세요",
    text: `인증을 완료하려면 다음 링크를 클릭하세요: http://13.124.211.71:3000/verify-email/${emailToken}`,
  };

  await transporter.sendMail(mailOptions);
};
export { sendMail };
