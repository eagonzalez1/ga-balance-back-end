import mongoose from "mongoose";

const Schema = mongoose.Schema

const postSchema = new Schema({
  author: {type: String, required: true}, 
  porfile: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
  type: String,
  headline: String,
  description: String,
  link: String,
  likes: [],
  photo: String,
}, {
  timestamps: true
})

const Post = mongoose.model('Post', postSchema)

export {
  Post
}