import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
  },
  parentId: {
    type: String
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  createdAt: { 
    type: Date, 
    default: Date.now() 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now() 
  },
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;