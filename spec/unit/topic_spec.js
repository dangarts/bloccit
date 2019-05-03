const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {

  beforeEach((done) => {
//#1
    this.topic;
    this.post;
    sequelize.sync({force: true}).then((res) => {

//#2
      Topic.create({
        title: "Expeditions to Alpha Centauri",
        description: "A compilation of reports from recent visits to the star system."
      })
      .then((topic) => {
        this.topic = topic;
//#3
        Post.create({
          title: "My first visit to Proxima Centauri b",
          body: "I saw some rocks.",
//#4
          topicId: this.topic.id
        })
        .then((post) => {
          this.post = post;
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

  });

//For the 'create' method, test that when calling 'Topic.create' with valid arguments, that a topic object is created and stored in the database. 

  describe("#create()", () => {

    it("should create a topic object with a title and discription", (done) => {
//#1
      Topic.create({
        title: "JS Frameworks",
        description: "There is a lot of them"
      })
      .then((topic) => {

//#2
        expect(topic.title).toBe("JS Frameworks");
        expect(topic.description).toBe("There is a lot of them");
        done();

      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });


    it("should not create a post with missing title or description", (done) => {
      Topic.create({
        title: "Pros of Cryosleep during the long journey",
        description: "Lorem ipsum"
      })
      .then((post) => {
 
       // the code in this block will not be evaluated since the validation error
       // will skip it. Instead, we'll catch the error in the catch block below
       // and set the expectations there
 
        done();
 
      })
      .catch((err) => {
 
        expect(err.message).toContain("Post.body cannot be null");
        expect(err.message).toContain("Post.topicId cannot be null");
        done();
 
      })
    });

  });


//For 'getPosts', create and associate a post with the topic in scope. The 'getPosts' method returns an array of 'Post' objects that are associated with the topic the method was called on. The test should confirm that the associated post is returned when that method is called.

  describe("#getPosts()", () => {

    it("should return the associated posts", (done) => {

      this.topic.getPosts()
      .then((associatedPosts) => {
        expect(associatedPosts[0].title).toBe("My first visit to Proxima Centauri b");
        done();
      });

    });

  });

});