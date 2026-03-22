import nodemailer from 'nodemailer'
export const sendEmail =async({
     to=[],
   cc=[],
   bcc=[],
   subject="hello",
   text="",
   html="",
   attachments=[]
}={})=>{

const transporter = nodemailer.createTransport({
    service:'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});


  const info = await transporter.sendMail({
    from: `"EDtechPlatform system" <${process.env.EMAIL}>`,
   to,
   cc,
   bcc,
   subject,
   text,
   html,
   attachments
  });

  console.log("Message sent:", info.messageId);
}   