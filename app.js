//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const e = require("express");
const _ = require("lodash");
const mongoose = require("mongoose");

const mongooseUrl = "mongodb://0.0.0.0:27017/BlogDb";

mongoose.connect(mongooseUrl);

const blogSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
  },
  { versionKey: false }
);

const BlogPost = mongoose.model("BlogPost", blogSchema);

// const firstBlogPost = new BlogPost({
//   title: "Title",
//   content:
//     "t velit egestas dui id ornare. St velit egestas dui id ornare. St velit egestas dui id ornare. St velit egestas dui id ornare. St velit egestas dui id ornare. St velit egestas dui id ornare. St velit egestas dui id ornare. St velit egestas dui id ornare. St velit egestas dui id ornare. St velit egestas dui id ornare. St velit egestas dui id ornare. St velit egestas dui id ornare. St velit egestas dui id ornare. St velit egestas dui id ornare. St velit egestas dui id ornare. St velit egestas dui id ornare. St velit egestas dui id ornare. St velit egestas dui id ornare. St velit egestas dui id ornare. S",
// });
// BlogPost.collection.insertOne(firstBlogPost);

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


 BlogPost.deleteMany({content: "[Verse 1: Dr. Dre & Snoop Dogg] It's still Dre Day nigga, AK nigga Though I've grown a lot, can't keep it home a lot 'Cause when I frequent the spots that I'm known to rock You hear the bass from the truck when I'm on the block Ladies they pay homage, but haters say Dre fell off How? Nigga, my last album was The Chronic (Nigga) They wanna know if he still got it They say rap's changed, they wanna know how I feel about it (If you ain't up on thangs) Dr. Dre is the name, I'm ahead of my game Still puffin' my leaves, still fuck with the beats Still not lovin' police (Huh-uh) Still rock my khakis with a cuff and a crease (For sho') Still got love for the streets, reppin' 213 (For life) Still the beats bang, still doin' my thang Since I left ain't too much changed, still"})


app.get("/", async (req, res) => {
  const blogPostList = await BlogPost.find({});
  if (blogPostList.length === 0) {
    try {
      res.render("home", {
        homeContent: homeStartingContent,
        posts: blogPostList,
      });
    } catch (error) {
      console.log(error.error);
    }
  } else {
    console.log("list is populated");
    res.render("home", {
      homeContent: homeStartingContent,
      posts: blogPostList,
    });
  }
});

app.get("/about", (req, res) => {
  try {
    res.render("about", { aboutContent: aboutContent });
  } catch (error) {}
});

app.get("/contact", (req, res) => {
  try {
    res.render("contact", { contactContent: contactContent });
  } catch (error) {}
});

app.get("/compose", (req, res) => {
  try {
    res.render("compose");
  } catch (error) {}
});

app.post("/compose", async (req, res) => {
  try {
    const postTitle = req.body.journalTitle;
    const postContent = req.body.journalBody;
    const newBlogPost = new BlogPost({
      title: postTitle,
      content: postContent,
    });
    await BlogPost.collection.insertOne(newBlogPost);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.get("/posts/:title", async (req, res) => {
  try {
    const posts = await BlogPost.find({})
    const reqTitle = _.lowerCase(req.params.title);
    posts.forEach((post) => {
      const postTitle = _.lowerCase(post.title);
      if (postTitle == reqTitle) {
        res.render("post", {
          title: post.title,
          content: post.content,
        });
        console.log("Match Found");
      }
    });
  } catch (error) {
    console.log("something failed at this endpoint");
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
