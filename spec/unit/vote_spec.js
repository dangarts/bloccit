const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Comment = require("../../src/db/models").Comment;
const User = require("../../src/db/models").User;
const Vote = require("../../src/db/models").Vote;

describe("Vote", () => {

  beforeEach((done) => {
    this.user;
    this.topic;
    this.post;
    this.vote;

    sequelize.sync({force: true}).then((res) => {

      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then((res) => {
        this.user = res;

        Topic.create({
          title: "Expeditions to Alpha Centauri",
          description: "A compilation of reports from recent visits to the star system.",
          posts: [{
            title: "My first visit to Proxima Centauri b",
            body: "I saw some rocks.",
            userId: this.user.id
          }]
        }, {
          include: {
            model: Post,
            as: "posts"
          }
        })
        .then((res) => {
          this.topic = res;
          this.post = this.topic.posts[0];

          Comment.create({
            body: "ay caramba!!!!!",
            userId: this.user.id,
            postId: this.post.id
          })
          .then((res) => {
            this.comment = res;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  //Define a suite for the create method.
  describe("#create()", () => {

    // Write a test to check that we successfully create an upvote.
    it("should create an upvote on a post for a user", (done) => {

      // Create an upvote for this.vote by this.user.
      Vote.create({
        value: 1,
        postId: this.post.id,
        userId: this.user.id
      })
      .then((vote) => {

        // Ensure the vote was successfully created.
        expect(vote.value).toBe(1);
        expect(vote.postId).toBe(this.post.id);
        expect(vote.userId).toBe(this.user.id);
        done();

      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    // Repeat for tests for a downvote.
    it("should create a downvote on a post for a user", (done) => {
      Vote.create({
        value: -1,
        postId: this.post.id,
        userId: this.user.id
      })
      .then((vote) => {
        expect(vote.value).toBe(-1);
        expect(vote.postId).toBe(this.post.id);
        expect(vote.userId).toBe(this.user.id);
        done();

      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    // Check that a vote is not created without a userId or postId assigned.
    it("should not create a vote without assigned post or user", (done) => {
      Vote.create({
        value: 1
      })
      .then((vote) => {

        // the code in this block will not be evaluated since the validation error
        // will skip it. Instead, we'll catch the error in the catch block below
        // and set the expectations there

        done();

      })
      .catch((err) => {

        expect(err.message).toContain("Vote.userId cannot be null");
        expect(err.message).toContain("Vote.postId cannot be null");
        done();

      })
    });

    // 1. ASSIGNMENT: Create a vote with a value of anything other than 1 or -1.
    it("Should not allow the vote value to be anything other then 1 or -1", (done) => {

      Vote.create({
        value: 0,
        postId: this.post.id,
        userId: this.user.id
      })
      .then((vote) => {
        //expect(vote.value).toBe(2);
        done();

      })
      .catch((err) => {
        expect(err.message).toContain("Validation isIn on value failed");
        done();
      });
    });





  });//end


  //Define a suite for the setUser method.
  describe("#setUser()", () => {

  it("should associate a vote and a user together", (done) => {

      Vote.create({           // create a vote on behalf of this.user
        value: -1,
        postId: this.post.id,
        userId: this.user.id
      })
      .then((vote) => {
        this.vote = vote;     // store it
        expect(vote.userId).toBe(this.user.id); //confirm it was created for this.user

        User.create({                 // create a new user
          email: "bob@example.com",
          password: "password"
        })
        .then((newUser) => {

          this.vote.setUser(newUser)  // change the vote's user reference for newUser
          .then((vote) => {

            expect(vote.userId).toBe(newUser.id); //confirm it was updated
            done();

          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      })
    });

  });


  //Define a suite for the getUser method.
  describe("#getUser()", () => {

    it("should return the associated user", (done) => {
      Vote.create({
        value: 1,
        userId: this.user.id,
        postId: this.post.id
      })
      .then((vote) => {
        vote.getUser()
        .then((user) => {
          expect(user.id).toBe(this.user.id); // ensure the right user is returned
          done();
        })
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

  });


  // Define a suite for the setPost method.
  describe("#setPost()", () => {

    it("should associate a post and a vote together", (done) => {

      Vote.create({           // create a vote on `this.post`
        value: -1,
        postId: this.post.id,
        userId: this.user.id
      })
      .then((vote) => {
        this.vote = vote;     // store it

        Post.create({         // create a new post
          title: "Dress code on Proxima b",
          body: "Spacesuit, space helmet, space boots, and space gloves",
          topicId: this.topic.id,
          userId: this.user.id
        })
        .then((newPost) => {

          expect(this.vote.postId).toBe(this.post.id); // check vote not associated with newPost

          this.vote.setPost(newPost)              // update post reference for vote
          .then((vote) => {

            expect(vote.postId).toBe(newPost.id); // ensure it was updated
            done();

          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });

  });


  // Define a suite for the getPost method.
  describe("#getPost()", () => {

    it("should return the associated post", (done) => {
      Vote.create({
        value: 1,
        userId: this.user.id,
        postId: this.post.id
      })
      .then((vote) => {
        this.comment.getPost()
        .then((associatedPost) => {
          expect(associatedPost.title).toBe("My first visit to Proxima Centauri b");
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

  });


  // Define a suite for the getPoints method of the post model.
  describe("#getPoints", () => {

    it("should return 1, the total points for the current post", (done) => {
        Vote.create({
          value: 1,
          userId: this.user.id,
          postId: this.post.id
        })
        .then((vote) => {
          //console.log([vote]);
          this.post.votes = [vote];
          this.vote = this.post.votes[0];
          expect(this.post.getPoints()).toBe(1);
          done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });


  // Define a suite for the hasUpvoteFor method of the post model.
  describe("#hasUpvoteFor()", () => {
    it("should return true if the user with the matching userId has an upvote for the post", (done) => {

      Vote.create({
        value: 1,
        userId: this.user.id,
        postId: this.post.id 
      })
      .then((vote) => {
        this.post.votes = [vote];
        this.vote = this.post.votes[0];
        expect(this.post.hasUpvoteFor()).toBe(true);
        done();
      })
    })
  });


  // Define a suite for the hasDownvoteFor method of the post model.
  describe("#hasDownvoteFor()", () => {
      it("should return true if the user with the matching userId has a downvote for the post", (done) => {

      Vote.create({
        value: -1,
        userId: this.user.id,
        postId: this.post.id 
      })
      .then((vote) => {
        this.post.votes = [vote];
        this.vote = this.post.votes[0];
        expect(this.post.hasDownvoteFor()).toBe(true);
        done();
      })
    })
  });

});