var express = require('express');
var app = express();

//Connecting to the Database

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/node-demo");


//Creating a Database Schema
var nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
});

var User = mongoose.model("User", nameSchema);

//home route
app.get('/',function(req,res){
    //res.sendFile(__dirname + "/views/index.html");
    res.render('add', {
        title: 'Add New User',
        firstName: '',
        lastName: ''   
    })
});
//add route
app.post('/',function(req,res){
   req.assert('firstName','First Name is required').notEmpty();
   req.assert('lastName','Last Name is required').notEmpty();

   /*  req.checkBody("firstName", "First Name is required.").notEmpty();
    req.checkBody("lastName", "Last Name is required.").notEmpty();
 */
    var errors = req.validationErrors();
    if (!errors) {
        var myData = new User(req.body);
        myData.save().then(function(item){              
              req.flash('success', 'Data added successfully!')                
              res.redirect('/view')
        }).catch(function(err){
              req.flash('error', err);
              res.render('add', {
                title: 'Add New User',
                firstName: user.firstName,
                lastName: user.lastName            
               });
        });
    } else {
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '\n'
        })                
        req.flash('error', error_msg) 

        res.render('add', { 
            title: 'Add New User',
            firstName: req.body.firstName,
            lastName: req.body.lastName
        })
    } 

});
//view route
app.get('/view',function(req,res){
    User.find({},function(err,result){
        if(err){
            res.json(err);
        }else{
            res.render('view', {data: result});
        }
    });
    //res.sendFile(__dirname + "/view/view.html");
});
//edit route
app.get('/edit/:user_id',function(req,res){
    let id = req.params.user_id;
   User.findOne({_id : id},function(err,result){
    if (err)
        res.send(err);
    else
        res.render('edit', {results: result});
   });
});

//update route
app.get('/edit/:user_id',function(req,res){
    let id = req.params.user_id;
   User.findOne({_id : id},function(err,result){
    if (err)
        res.send(err);
    else
        res.render('edit', {            
                title: 'Edit User',
                results:result       
        
        
        });
   });
});

//update route
app.post('/edit/:user_id', function(req, res) {   

    req.assert('firstName','First Name is required').notEmpty();
    req.assert('lastName','Last Name is required').notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
        let id = req.params.user_id;
        var data = {
            firstName : req.body.firstName,
            lastName : req.body.lastName
        }
    
        // save the user
        User.findByIdAndUpdate(id, data, function(err, result) {
        if (err) throw err;
        req.flash('success', 'Data updated  successfully!')                
        res.redirect('/view')
        });
    } else {
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '\n'
        })                
        req.flash('error', error_msg) 
        res.redirect('/edit/'+ req.params.user_id)

    }
});

// delete route
app.post('/delete/:user_id', function(req, res) {
	//console.log(req.params.user_id);
	let id = req.params.user_id;
	User.remove({
		_id : id
	}, function(err) {
		if (err)
			res.send(err);
		else
            //res.send('Successfully! User has been Deleted.');	
            res.redirect('/view');
	});
});

module.exports = app
