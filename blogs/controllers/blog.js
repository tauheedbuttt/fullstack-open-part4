const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/:id", async (request, response) => {
  const { id } = request.params;
  const blog = await Blog.findById(id);
  if (blog) return response.json(blog);
  else return response.status(404).json({ error: "Blog not found." });
});

blogRouter.delete("/:id", async (request, response) => {
  const { id } = request.params;
  await Blog.findByIdAndDelete(id);
  return response.status(204).send();
});

blogRouter.put("/:id", async (request, response) => {
  const { id } = request.params;

  if (!request.body)
    return response.status(400).json({ error: "Blog data is required" });

  const { title, author, url, likes } = request.body;

  const blog = await Blog.findByIdAndUpdate(
    id,
    { title, author, url, likes },
    { new: true }
  );

  if (!blog) return response.status(404).send();

  return response.status(200).json(blog);
});

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  return response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);

  const result = await blog.save();
  response.status(201).json(result);
});

module.exports = blogRouter;
