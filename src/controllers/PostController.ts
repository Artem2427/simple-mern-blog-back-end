import { Request, Response } from "express";
import { AuthType } from "../middleware/checkAuth";

import Post, { IPost } from "../models/Post";

const getAll = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("user").exec();

    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something go wrong" });
  }
};

const getLastTags = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something go wrong" });
  }
};

const getOne = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response
) => {
  try {
    const postId = req.params.id;

    Post.findOneAndUpdate(
      { _id: postId },
      {
        // обяснили что сделать в даном случаюю увеличели на одиницу
        $inc: {
          viewsCount: 1,
        },
      },
      {
        // говорим вернуть обновленный документ
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Failed to return article" });
        }

        if (!doc) {
          return res
            .status(404)
            .json({ message: "Article has not been found" });
        }

        res.status(200).json(doc);
      }
    ).populate("user");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something go wrong" });
  }
};

const remove = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response
) => {
  try {
    const postId = req.params.id;

    Post.findOneAndDelete(
      {
        _id: postId,
      },
      {},
      (err, doc) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Failed to delete article" });
        }

        if (!doc) {
          return res
            .status(404)
            .json({ message: "Article has not been found" });
        }

        res.json({
          success: true,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something go wrong" });
  }
};

const create = async (
  req: Request<{}, {}, IPost & AuthType, {}>,
  res: Response
) => {
  try {
    const doc = new Post({
      ...req.body,
      user: req.body.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

const update = async (
  req: Request<{ id: string }, {}, IPost & AuthType, {}>,
  res: Response
) => {
  try {
    const postId = req.params.id;

    await Post.updateOne(
      { _id: postId },
      {
        ...req.body,
        user: req.body.userId,
      }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export default { create, getAll, getOne, remove, update, getLastTags };
