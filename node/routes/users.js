var express = require('express');
var router = express.Router();

var User = require('../models/user');
let usersArray = [];

var Template = require('../models/template');
let templatesArray = [];

var Contact = require('../models/contact');
let contactsArray = [];

var Company = require('../models/company');
let companyArray = [];

var Job = require('../models/jobTitle');
let jobArray = [];

let results = [];
let result = {};

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) {
      console.log('Database Error:', err);
    }
    console.log('Users: ', users);
    res.set({'Content-Type': 'text/html'});
    return res.json(users);
    res.render('users/index', {
      users: users,
      title: 'Blaster Users'
    });
  });
});

router.get('/:userId', function(req, res) {
  User.findById(req.params.userId, function(err, user) {
    if (err) {
      console.log('err: ', err);
    }
    res.set({'Content-Type': 'text/html'});
    return res.json(user);
    res.render('users/show', {
      user: user,
      title: 'Blaster User' + ' ' + user.firstName
    });
  });
});

router.get('/:id/search', function(req, res, next){
  let search = req.query;
  console.log(search);

  User.findById(req.params.id, function(err, user){
    console.log('The body request from client: ', search);

    if (err) {
      console.log('err: ', err);
    }
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.company = req.body.company || user.company;
    user.dateCreated = req.body.dateCreated || user.dateCreated;
    user.id = req.body.id || user.id;
    user.email = req.body.email || user.email;
    user.position = req.body.position || user.position;
    user.credits += -1;

    user.save(function(err, user){
      if (err) {
        console.log('err: ', err);
      }
    });

    Company.find({name: req.query.company}, function(err, company) {
      if (err) { console.log('err: ', err); }
      Contact.find({ company: company[0]._id }, function(err, contacts) {
        if (err) { console.log('err: ', err); }
        console.log('Company: ', company[0].name)
        console.log('Contact: ', contacts)

        res.set({'Content-Type': 'text/html'});
        return res.json(contacts);
      })
    })
  });
});

router.post('/', function(req, res, next){
  console.log('user name is: ', req.body.firstName);
  var newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    company: req.body.company,
    dateCreated: req.body.dateCreated,
    id: req.body.id,
    email: req.body.email,
    credits: req.body.credits
  });

  newUser.save(function(err, user){
    if(err){
      res.status(500).send({
        status: 'Error',
        error: err
      });
    } else {
      res.status(200).json({
        status: 'OK',
        user: user
      });
    }
  });
});

router.patch('/:id', function(req, res, next){
  User.findByIdAndUpdate(req.body.id, function(err, user){
    console.log('The body request from client: ', req.body);
    if(err) console.log(err);

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.company = req.body.company || user.company;
    user.dateCreated = req.body.dateCreated || user.dateCreated;
    user.id = req.body.id || user.id;
    user.email = req.body.email || user.email;
    user.position = req.body.position || user.position;
    user.credits = req.body.credits || user.credits;

    user.save(function(err, user){
      if(err) console.log(err);
      res.set({'Content-Type': 'application/json'});
      res.json({
        status: 'updated!',
        updated_user: user
      });
    });
  });
});

router.put('/:id', function(req, res, next){
  User.findByIdAndUpdate(req.params.id, function(err, user){
    console.log('The body request from client: ', req.body);
    if (err) {
      console.log('err: ', err);
    }
    res.set({'Content-Type': 'application/json'});

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.company = req.body.company || user.company;
    user.dateCreated = req.body.dateCreated || user.dateCreated;
    user.id = req.body.id || user.id;
    user.email = req.body.email || user.email;
    user.position = req.body.position || user.position;
    user.credits = req.body.credits || user.credits;

    user.save(function(err, user){
      if (err) {
        console.log('err: ', err);
      }
      res.json({
        status: 'updated!',
        updated_user: user
      });
    });
  });
});

module.exports = router;
