const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const multer = require("multer");

const upload = multer({ dest: "uploads/" }); // Destination folder for uploaded files

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);

// CORS middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500"); // Update this to your frontend URL
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const dataPath = path.join(__dirname, "data.json");

function readData(callback) {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading data:", err);
      callback([]);
    } else {
      try {
        const parsedData = JSON.parse(data);
        callback(parsedData);
      } catch (parseError) {
        console.error("Error parsing data:", parseError);
        callback([]);
      }
    }
  });
}
app.get("/blogs", (req, res) => {
  readData((items) => {
    res.json(items);
  });
});
app.post("/blogs/post", upload.single("image"), (req, res) => {
  const filePath = path.join(__dirname, "data.json");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const posts = JSON.parse(fileContent);

  const post = {
    id: posts.length + 1,
    title: req.body.title,
    content: req.body.content,
    picture: req.file ? req.file.filename : null,
  };
  posts.push(post);

  fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

  res.status(201).json({ message: "Post added successfully" });
});

// Delete post
app.delete("/api/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const filePath = path.join(__dirname, "data.json");
  let fileContent = fs.readFileSync(filePath, "utf8");
  let posts = JSON.parse(fileContent);

  // Find the index of the post with the given ID
  const index = posts.findIndex((post) => post.id === postId);

  if (index !== -1) {
    // Remove the post from the array
    posts.splice(index, 1);

    // Rewrite the JSON file without the deleted post
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

    res.status(200).json({ message: "Post deleted successfully" });
  } else {
    res.status(404).json({ message: "Post not found" });
  }
});

// Update post
app.put("/api/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content } = req.body;
  const filePath = path.join(__dirname, "data.json");
  let fileContent = fs.readFileSync(filePath, "utf8");
  let posts = JSON.parse(fileContent);

  // Find the index of the post with the given ID
  const index = posts.findIndex((post) => post.id === postId);

  if (index !== -1) {
    // Update post data
    posts[index].title = title;
    posts[index].content = content;

    // Rewrite the JSON file with updated post data
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

    res.status(200).json({ message: "Post updated successfully" });
  } else {
    res.status(404).json({ message: "Post not found" });
  }
});

app.listen(3000, () => {
  console.log("server running ....");
});
