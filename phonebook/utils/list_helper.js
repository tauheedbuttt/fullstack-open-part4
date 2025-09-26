const dummy = (blogs) => {
  console.log(blogs);
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.map((item) => item.likes).reduce((a, b) => a + b, 0);
};

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map((item) => item.likes));
  const blog = blogs.find((item) => item.likes === maxLikes);
  return blog;
};

const mostBlogs = (blogs) => {
  const authors = {};
  blogs.forEach((blog) => {
    authors[blog.author] = (authors[blog.author] ?? 0) + 1;
  });

  const authorWithBlog = Object.keys(authors).map((key) => ({
    author: key,
    blogs: authors[key],
  }));

  const mostBlogs = Math.max(...authorWithBlog.map((item) => item.blogs));
  const authorWithMostBlogs = authorWithBlog.find(
    (item) => item.blogs === mostBlogs
  );

  return authorWithMostBlogs;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
