const passport = require('passport');
const express = require('express');
const router = express.router();

const options = { 
	successRedirect: '/',
	failureRedirect: '/',
	failureFlash: true,
	successFlash: true
}
router.post('/login', passport.authenticate('local', options));

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/', (req, res) => {
	res.send(req.flash('error'));
});

module.exports = {
	router: router
}