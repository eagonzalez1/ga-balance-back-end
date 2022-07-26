import {Post} from '../models/post.js'
import { Profile } from '../models/profile.js'

function create(req, res) {
  req.body.author = req.user.name
  req.body.profile = req.user.profile
  console.log(req)
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
    cloudinary.uploader.upload(imageFile, {tags: `${post.review}`})
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
  .populate('author')
  .populate('restaurant')
  .populate('item')
  .then(post => res.json(post))
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
}

function createComment(req, res) {
  Post.findById(req.params.id)
  .populate('author')
  .populate('restaurant')
  .populate('item')
  .then(post => {
    Profile.findById(req.user.profile)
    .then(profile => {
      req.body.author = profile.name
      post.comments.push(req.body)
      post.save()
      .then(updatedPost => res.json(updatedPost))
    })
  })
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
}

function deleteComment(req, res) {
  Post.findById(req.params.id)
  .populate('author')
  .populate('restaurant')
  .populate('item')
  .then(post => {
    post.comments.remove({_id:req.params.commentId})
    post.save()
    .then(updatedPost => res.json(updatedPost))
  })
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
}

function like(req, res) {
  const user = req.user
  Post.findById(req.params.id)
  .populate('author')
  .populate('restaurant')
  .populate('item')
  .then(post => {
    if(!post.likes.some(like => {
      return like === user.profile
    })) {
      post.likes.push(user.profile)
      post.save()
      .then(likePost => res.json(likePost))
    } else if(post.likes.some(like => {
      return like === user.profile
    })) {
      post.likes.remove(user.profile)
      post.save()
      .then(likePost =>res.json(likePost))
    }
  })
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
    createComment,
    deleteComment,
    like
}