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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
