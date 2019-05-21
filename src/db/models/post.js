'use strict';
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false
    //}
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Post.associate = function(models) {
    // associations can be defined here
    Post.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE"
    });

    Post.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

    Post.hasMany(models.Comment, {
      foreignKey: "postId",
      as: "comments"
    });

    Post.hasMany(models.Vote, {
      foreignKey: "postId",
      as: "votes"
    });
  };

  // Adds up points. Check if the post has votes. If not, return 0.
  Post.prototype.getPoints = function(){
    if(this.votes.length === 0) return 0 
    return this.votes // array of Vote objects
      .map((v) => { return v.value }) // creates an array of values
      .reduce((prev, next) => { return prev + next }); // adds all the values
  };

  // returns true if user has an upvote for the post
  Post.prototype.hasUpvoteFor = function(userId){
    return this.votes[0].value == 1;
  };

   // returns true if user has an downvote for the post
  Post.prototype.hasDownvoteFor = function(userId){
    return this.votes[0].value == -1;
  };

  return Post;
};