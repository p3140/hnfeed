var koa = require('koa');
var router = require('koa-router');
var bodyParser = require('koa-body');
var app = new koa();
var mongoose = require('mongoose');

mongoose.connect('mongodb://root:12345@localhost/admin');

//Set up Pug
var Pug = require('koa-pug');
var pug = new Pug({
   viewPath: './views',
   basedir: './views',
   app: app 
});

//Set up body parsing middleware
app.use(bodyParser({
   formidable:{uploadDir: './uploads'},    //This is where the files would come
   multipart: true,
   urlencoded: true
}));

var _ = router(); //Instantiate the router

var personSchema = mongoose.Schema({
   name: String,
   age: Number,
   nationality: String
});

var Person = mongoose.model("Person", personSchema);

_.get('/person', (ctx, next)=>{
   ctx.render('form');
});

_.post('/person', function *(ctx, next){
   var self = ctx;
   var personInfo = ctx.request.body; //Get the parsed information
   if(!personInfo.name || !personInfo.age || !personInfo.nationality){
      ctx.render('show_message', {message: "Sorry, you provided wrong info", type: "error"});
   } else {
   	  yield ctx.render('form')
      var newPerson = new Person({
         name: personInfo.name,
         age: personInfo.age,
         nationality: personInfo.nationality
      });
      yield newPerson.save(function(err, res) {
         if(err){	
         	console.log(err, 'error?');
            ctx.render('show_message', 
               {message: "Database error", type: "error"});
        }
         else{
         	console.log("success??", ctx);
            ctx.body = "hola";
    	}
      });
   }
});

app.use(_.routes()); 

app.listen(3000);