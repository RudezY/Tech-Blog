// Dashboard Routes
// This is a set of routes that will be used to render the dashboard pages.
// All of these routes will be protected by the withAuth middleware function.

const router = require("express").Router();
const { Post, User, Comment } = require("../models/");
const withAuth = require("../utils/auth");

// TODO - create logic for the GET route for / that renders the dashboard homepage
// It should display all of the posts created by the logged in user
router.get("/", withAuth, async (req, res) => {
  // TODO - retrieve all posts from the database for the logged in user
  // render the dashboard template with the posts retrieved from the database
  //default layout is set to main.handlebars, layout need to be changed to dashboard to use dashboard.handlebars
  try {
    const userPost = await Post.findAll({
      where: { userId: req.session.userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Comment,
          include: [{ model: User, attributes: ["username"] }],
        },
      ],
    });
    const posts = userPost.map((post) => post.get({ plain: true }));
    console.log(JSON.stringify(posts), "posts");
    res.render("admin-all-posts", { layout: "dashboard", posts });
  } catch (error) {
    res.redirect("/login");
  }
  // refer to admin-all-posts.handlebars write the code to display the posts
});
router.get("/create", withAuth, async (req, res) => {
  res.render("admin-create-post", { layout: "dashboard" });
});

// TODO - create logic for the GET route for /new that renders the new post page
// It should display a form for creating a new post
router.get("/new", withAuth, async (req, res) => {
  res.render("new-post", { layout: "dashboard" });
});


module.exports = router;
