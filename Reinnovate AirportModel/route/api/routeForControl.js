var express = require('express');
var router = express.Router();

router.get('/',(req,res)=>{
	console.log("Inside /api/");
	res.render("home");
});

router.get('/home',(req,res)=>{
	console.log("Inside /api/home");
	res.render("home");
});

router.get('/control',(req,res)=>{
	console.log("Inside /api/control");
	res.render("control");

});

router.get('/about',(req,res)=>{
	console.log("Inside /api/about");
	res.render("about");

});



module.exports = router;