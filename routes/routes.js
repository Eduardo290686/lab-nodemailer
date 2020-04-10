const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");

const User = require("../models/user");

const router = express.Router();

const bcryptSalt = 10;

const textRegExp = /.+/;
const emailRegExp = /.+@.+.com$/;

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/sign-up', (req, res) => {
  res.render('sign-up');
})

router.post('/sign-up', (req, res) => {

  let userName = req.body.name;
  let userPassword = req.body.password;
  let userEmail = req.body.email;
  let userConfirmationCode = "";

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }

  userConfirmationCode = token;

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(userPassword, salt);

  if (textRegExp.test(userName) && textRegExp.test(userPassword) &&
    emailRegExp.test(userEmail)) {
    User.create({
      name: userName,
      password: hashPass,
      email: userEmail,
      confirmationCode: userConfirmationCode
    })
      .then((user) => {

        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: `${process.env.EMAIL}`,
            pass: `${process.env.EMAIL_PASSWORD}`
          }
        });
        transporter.sendMail({
          from: `Merluzo Project <${process.env.EMAIL}>`,
          to: userEmail,
          subject: "Account confirmation",
          text: `http://localhost:3000/auth/confirm/${userConfirmationCode}`
        })
          .then(info => res.render('not-confirmed', { userName }))
          .catch(error => console.log(error));

      })
  } else {
    res.render('sign-up', { message: "Introduce the information correctly" });
  }

});

router.get('/auth/confirm/:confirmationCode', (req, res) => {
  let userConfirmationCode = req.params.confirmationCode;

  User.find()
    .then((allUsers) => {
      let users = allUsers;
      let choosenUser = {};
      let confirmed = false;
      users.forEach((user) => {
        if (user.confirmationCode === userConfirmationCode) {
          choosenUser = user;
          confirmed = true;
        }
      })
      if (confirmed === true) {
        let userName = choosenUser.name;
        res.render('confirmed', { userName });
      } else {
        res.send('confirmation mistaken');
      }
    })

})

module.exports = router;
