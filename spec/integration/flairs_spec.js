const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;

describe("routes : flairs", () => {


//INTEGRATION///////////////////////////////
  beforeEach((done) => {
    this.topic;
    this.post;
    this.flair;

    sequelize.sync({force: true}).then((res) => {
      Topic.create({
        title: "Winter Games",
        description: "Post your Winter Games stories."
      })
      .then((topic) => {
        this.topic = topic;
        Post.create({
          title: "Snowball Fighting",
          body: "So much snow!",
          topicId: this.topic.id
        })
        .then((post) => {
          this.post = post;
          Flair.create({
            name:"waiting",
            color: "yellow",
            postId: this.post.id
          })
          .then((flair) =>{
            this.flair = flair;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });
  }); // END beforeEach


/////////////////////////////////
  describe("GET /posts/:id/flairs/new", () => {
    it("should render a new flair form", (done) => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}/flairs/new`, (err, res, body) => {
        
        
        //console.log(base);
        expect(err).toBeNull();
        expect(body).toContain("New Flair");
        done();
      });
    });
  });// END GET .../flairs/new


/////////////////////////////////
  describe("POST /topics/:id/posts/:id/flairs/create", () => {

    it("should create a new flair and redirect", (done) => {
       const options = {
         url: `${base}/${this.topic.id}/posts/${this.post.id}/flairs/create`,
         form: {
           name: "pending",
           color: "gray"
         }
       };
       request.post(options,
         (err, res, body) => {
           Flair.findOne({where: {name: "pending"}})
           .then((flair) => {
             expect(flair).not.toBeNull();
             expect(flair.name).toBe("pending");
             expect(flair.color).toBe("gray");
             expect(flair.postId).not.toBeNull();
             done();
           })
           .catch((err) => {
             console.log(err);
             done();
           });
         }
       );
     });
  }); // END POST .../flairs/create


/////////////////////////////////
  describe("GET /topics/:id/posts/:id/flairs/:id", () => {
    it("should render a view with the selected flair", (done) => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("waiting");
        done();
      });
    });
  });//END GET .../flairs/:id


/////////////////////////////////
  describe("POST /topics/:id/posts/:id/flairs/:id/destroy", () => {
    it("should delete the flair with the associated ID", (done) => {
      expect(this.flair.id).toBe(1);
      request.post(`${base}/${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}/destroy`, (err, res, body) => {
        Flair.findById(1)
        .then((flair) => {
          expect(err).toBeNull();
          expect(flair).toBeNull();
          done();
        })
      });
    });
  });// END POST .../flairs/:id/destroy


/////////////////////////////////
  describe("GET /topics/:id/posts/:id/flairs/:id/edit", () => {
    it("should render a view with an edit flair form", (done) => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Flair");
        expect(body).toContain("waiting");
        done();
      });
    });
  });// END GET .../flairs/:id/edit

/////////////////////////////////
  describe("GET /topics/:id/posts/:id/flairs/:id/edit", () => {
    it("should render a view with an edit post form", (done) => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Post");
        expect(body).toContain("Snowball Fighting");
        done();
      });
    });
  });// END GET .../flairs/:id/edit


/////////////////////////////////
  describe("POST /topics/:id/posts/:id/flairs/:id/update", () => {
    it("should return a status code 302", (done) => {
      request.post({
        url: `${base}/${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}/update`,
        form: {
          name: "waiting",
          color: "blue"
        }
      }, (err, res, body) => {
        expect(res.statusCode).toBe(302);
        done();
      });
    }); //end it

    it("should update the flair with the given values", (done) => {
        const options = {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}/update`,
          form: {
            name: "waiting"
          }
        };
        request.post(options,
          (err, res, body) => {

          expect(err).toBeNull();

          Flair.findOne({
            where: {id: this.flair.id}
          })
          .then((flair) => {
            expect(flair.name).toBe("waiting");
            done();
          });
        });
    });//end it
  });// END POST .../flairs/:id/update

  
}); // END ALLLLL