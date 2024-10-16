const PostShchema = require("../models/post");

const getPosts = async (req, res) => {
  try {
    const getPosts = await PostShchema.find();

    res.status(200).json(getPosts);
  } catch (error) {
    res.status(200).json({ msg: error });
  }
};
const createPost = async (req, res) => {
  try {
    const newPost = await PostShchema.create(req.body);

    res.status(200).json(newPost);
  } catch (error) {
    res.status(200).json({ msg: error });
  }
};
const updatePost = async (req, res) => {
  const { id } = req.params;
  try {
    const update = await PostShchema.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(update);
  } catch (error) {
    res.status(200).json({ msg: error });
  }
};
const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await PostShchema.findByIdAndRemove(id);

    res.status(200).json({ msg: "Silme işlemi başarılı !" });
  } catch (error) {
    res.status(200).json({ msg: error });
  }
};

module.exports = { getPosts, createPost, updatePost, deletePost };
