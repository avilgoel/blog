var bodyParser       = require("body-parser"),
	methodOverride	 = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	mongoose         = require('mongoose'),
	express          = require("express"),
	app              = express();
	
	

mongoose.connect('mongodb://localhost:27017/restful_blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine","ejs");

app.use(express.static("public"));

app.use(expressSanitizer());   //should be after body-parser

app.use(methodOverride("_method"));

var blogSchema=new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default:Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);

// Blog.create({
// 	title: "Test",
// 	image: "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
// 	body: "Hello, and welcome to my blog. Meet my dog Bruno!! He's lovely, ain't he?"
// });


app.get("/",function(req,res){
	
	res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
	
	Blog.find({},function(err,blogs){
		
		if(err){
			console.log("Error!!");		
	}
		else{
			res.render("index",{blogs:blogs});
		}
	});
	
	
	
});

app.get("/blogs/new",function(req,res){
	
	res.render("new");
	
});

app.post("/blogs",function(req,res){
	
	req.body.blog.body=req.sanitize(req.body.blog.body);
	
	Blog.create(req.body.blog,function(err,newBlog){
		
		if(err)
			{
				res.render("new");
			}
		else
			{
				res.redirect("/blogs");
			}
		
		
		
	});
	
	
	
});

app.get("/blogs/:id",function(req,res){
	
	Blog.findById(req.params.id,function(err,foundBlog){
		
		if(err)
			{
				res.redirect("/blogs");
			}
		else
			{
				res.render("show", {blog: foundBlog });
			}
		
		
	});
	

		
	
	
});


app.get("/blogs/:id/edit",function(req,res){
	
	Blog.findById(req.params.id,function(err,foundBlog){
		
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("edit",{blog:foundBlog});
		}
		
	});
	
	
});

app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err,updatedBlog){
		
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/"+req.params.id);	
		}
		
	});

	
});


app.delete("/blogs/:id",function(req,res){
	
	Blog.findByIdAndRemove(req.params.id,function(err){
		
		if(err){
			res.redirect("/blogs");
		}
		else
			{
				res.redirect("/blogs");
			}
	});
	
});



app.listen(3000,function(){
	console.log("The Blog App Server has started...");
});