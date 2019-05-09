const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;

describe("Post", () => {


//UNIT///////////////////////////////
  beforeEach((done) => {
    this.topic;
    this.post;
    this.flair;

    sequelize.sync({force: true}).then((res) => {
      Topic.create({
        title: "Expeditions to Alpha Centauri",
        description: "A compilation of reports from recent visits to the star system."
      })
      .then((topic) => {
        this.topic = topic;
        Post.create({
          title: "My first visit to Proxima Centauri b",
          body: "I saw some rocks.",
          topicId: this.topic.id
        })
        .then((post) => {
          this.post = post;
          Flair.create({
            name: "priority",
            color: "red",
            postId: this.post.id
          })
          .then((flair) => {
            this.flair = flair;
            done();
          });
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  }); // END beforeEach


/////////////////////////////////
  describe("#create()", () => {
    it("should create a flair object with a name, color and assigned post", (done) => {
      Flair.create({
        name: "proceed",
        color: "green",
        postId: this.post.id
      })
      .then((flair) => {
        expect(flair.name).toBe("proceed");
        expect(flair.color).toBe("green");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    }); // end it

    it("should not create a flair with missing name, color, or assigned post", (done) => {
      Flair.create({
        title: "Pros of Cryosleep during the long journey"
      })
      .then((flair) => {
       // the code in this block will not be evaluated since the validation error
       // will skip it. Instead, we'll catch the error in the catch block below
       // and set the expectations there
        done();
 
      })
      .catch((err) => {
        expect(err.message).toContain("Flair.color cannot be null");
        expect(err.message).toContain("Flair.postId cannot be null");
        done();
      })
    }); // end it
  }); // END #create()


/////////////////////////////////
  describe("#setPost()", () => {
    it("should associate a topic and a post together", (done) => {
      Topic.create({
        title: "Challenges of interstellar travel",
        description: "1. The Wi-Fi is terrible"
      })
      .then((newTopic) => {
        //expect(this.post.topicId).toBe(this.topic.id);
        this.post.setTopic(newTopic)
        .then((newPost) => {
          this.flair.setPost(newPost)
          .then((flair) => {
            //this.flair.setPost(newPost)
            expect(flair.postId).toBe(newPost.id);
            //console.log(post);
            done();
          });
        });
      });
    });
  }); // END #setPost()


/////////////////////////////////
  describe("#getPost()", () => {
    it("should return the associated post", (done) => {
      this.flair.getPost()
      .then((associatedPost) => {
        expect(associatedPost.title).toBe("My first visit to Proxima Centauri b");
        done();
      });
    });
  }); // END #getPost

}); // END ALLLLL