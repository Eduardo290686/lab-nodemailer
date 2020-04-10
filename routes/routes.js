
const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/sign-up', (req, res) => {
  res.render('sign-up');
})

router.post('/sign-up', (req, res) => {

  let { email, subject, message } = req.body;
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: `${process.env.EMAIL}`,
      pass: `${process.env.PASSWORD}`
    }
  });
  transporter.sendMail({
    from: `Merluzo Project <${process.env.EMAIL}>`,
    to: email,
    subject: subject,
    text: message,
    html: `<b>${message}</b>`
  })
    .then(info => res.render('message', { email, subject, message, info }))
    .catch(error => console.log(error));

  res.render('confirm');

});

module.exports = router;
