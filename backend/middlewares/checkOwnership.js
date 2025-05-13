import BlogPost from '../models/blogPostSchema.js';

const checkOwnership = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this post' });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default checkOwnership;
