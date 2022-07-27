import {Post} from '../models/post.js'
import { Profile } from '../models/profile.js'
import { v2 as cloudinary } from 'cloudinary'

function create(req, res) {
  req.body.author = req.user.name
  req.body.profile = req.user.profile
  Post.create(req.body)
  .then(post => {
      res.json(post)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
}

function index(req, res) {
    Post.find({})
    .then(posts => {
        res.json(posts)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({err: err.errmsg})
      })

}

function deletePost(req, res){
  Post.findByIdAndDelete(req.params.id)
  .then(deletedPost => {
    res.json(deletedPost)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
}

function update(req, res) {
    Post.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .populate('author')
    .populate('restaurant')
    .populate('item')
    .then(updatedPost => {
      res.json(updatedPost)
    })
    .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
}

function addPhoto(req, res) {
  const imageFile = req.files.photo.path
  Post.findById(req.params.id)
  .then(post => {
    cloudinary.uploader.upload(imageFile, {tags: `${post.headline}`})
    .then(image => {
      post.photo = image.url
      post.save()
      .then(post => {
        res.status(201).json(post.photo)
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
  })
}

function show(req, res) {
  Post.findById(req.params.id)
  .then(post => res.json(post))
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
}

export {
    create,
    index,
    deletePost as delete,
    update,
    addPhoto,
    show,
}