const postQueries = require("../db/queries.posts.js");

module.exports = {
  router.get("/topics/:topicId/posts/new", postController.new);
}