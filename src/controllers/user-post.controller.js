const { View } = require("../view/view");
const { Keyboards } = require("../keyboards/keyboard");

class UserPostController {
  #userServices;
  #postServices;
  #commentServices;
  #view;
  #keyboards;
  constructor(UserServices, PostServices, CommentServices) {
    this.#userServices = UserServices;
    this.#postServices = PostServices;
    this.#commentServices = CommentServices;
    this.#view = new View(UserServices, PostServices, CommentServices);
    this.#keyboards = new Keyboards();
  }

  async userPost(ctx) {
    if (ctx.message.text === ctx.i18n.t("buttons.back")) {
      this.#view.mainMenu(ctx);
    } else if (ctx.message.text === ctx.i18n.t("buttons.newPost")) {
      this.#view.newPost(ctx);
    } else if (ctx.message.text === ctx.i18n.t("buttons.getPost")) {
      ctx.session.post_iterator = 0;
      const post = await this.#postServices.getPostById(
        ctx.session.user.posts[0]
      );
      if (!post) {
        return this.#view.notPost(ctx);
      }
      ctx.session.post = post;
      // console.log("post :>> ", post);
      this.#view.getMyPost(ctx, post);
    } else {
      this.#view.userPost(ctx);
    }
  }

  async newPost(ctx) {
    if (ctx.message.text === ctx.i18n.t("buttons.back")) {
      this.#view.userPost(ctx);
    } else if (ctx.message.text === ctx.i18n.t("buttons.mainMenu")) {
      this.#view.mainMenu(ctx);
    } else {
      const newPost = await this.#postServices.newPost(ctx.from.id, {
        content: ctx.message.text,
      });
      ctx.session.user.posts.unshift(newPost._id);
      this.#view.choosingHashtag(ctx);
    }
  }

  async choosingHashtag(ctx) {
    const newPostId = ctx.session.user.posts[0].toString();
    if (ctx.message.text === ctx.i18n.t("buttons.skip")) {
      const post = await this.#postServices.getPostById(newPostId);
      this.#view.postCreated(ctx, post);
    } else {
      const post = await this.#postServices.updatePost(newPostId, ctx.from.id, {
        hashtags: [ctx.message.text],
      });
      this.#view.postCreated(ctx, post);
    }
  }

  async getMyPost(ctx) {
    if (ctx.message.text === ctx.i18n.t("buttons.back")) {
      this.#view.userPost(ctx);
    } else if (ctx.message.text === ctx.i18n.t("buttons.getComments")) {
      ctx.session.comment_iterator = 0;
      const comment = await this.#commentServices.getCommentById(
        ctx.session.post.comments[0]
      );

      if (!comment) {
        return this.#view.notComment(ctx);
      }
      const author = await this.#userServices.getUserById(comment.user);
      this.#view.getComments(ctx, comment, author);
    } else if (ctx.message.text === ctx.i18n.t("buttons.updatePost")) {
      this.#view.updatePost(ctx);
    } else if (ctx.message.text === ctx.i18n.t("buttons.deletePost")) {
      this.#view.deletePost(ctx);
    }
  }

  async getUserPostComment(ctx) {
    if (ctx.message.text === ctx.i18n.t("buttons.back")) {
      const post = await this.#postServices.getPostById(
        ctx.session.user.posts[ctx.session.post_iterator]
      );
      ctx.session.post = post;
      this.#view.getMyPost(ctx, post);
    } else if (ctx.message.text === ctx.i18n.t("buttons.mainMenu")) {
      this.#view.mainMenu(ctx);
    }
  }

  async inlineComment(ctx) {
    const newIterator = parseInt(ctx.update.callback_query.data);
    if (newIterator < 0) {
      ctx.session.comment_iterator = ctx.session.post.comments.length - 1;
    } else if (newIterator === ctx.session.post.comments.length) {
      ctx.session.comment_iterator = 0;
    } else if (newIterator === ctx.session.comment_iterator) {
      return null;
    } else {
      ctx.session.comment_iterator = newIterator;
    }
    console.log("ctx.session.post :>> ", ctx.session.comment_iterator);
    const comment = await this.#commentServices.getCommentById(
      ctx.session.post.comments[ctx.session.comment_iterator]
    );
    const author = await this.#userServices.getUserById(comment.user);
    this.#view.changeOfComment(ctx, comment, author);
  }

  async getMyPostInline(ctx) {
    const newIterator = parseInt(ctx.update.callback_query.data);
    if (newIterator < 0) {
      ctx.session.post_iterator = ctx.session.user.posts.length - 1;
    } else if (newIterator === ctx.session.user.posts.length) {
      ctx.session.post_iterator = 0;
    } else if (newIterator === ctx.session.post_iterator) {
      return null;
    } else {
      ctx.session.post_iterator = newIterator;
    }
    const post = await this.#postServices.getPostById(
      ctx.session.user.posts[ctx.session.post_iterator]
    );
    ctx.session.post = post;
    this.#view.changeOfPost(ctx, post);
  }

  async updatePost(ctx) {
    if (ctx.message.text === ctx.i18n.t("buttons.back")) {
      const post = await this.#postServices.getPostById(
        ctx.session.user.posts[ctx.session.post_iterator]
      );
      this.#view.getMyPost(ctx, post);
    } else if (ctx.message.text === ctx.i18n.t("buttons.mainMenu")) {
      this.#view.mainMenu(ctx);
    } else {
      const post = await this.#postServices.updatePost(
        ctx.session.user.posts[ctx.session.post_iterator],
        ctx.from.id,
        {
          content: ctx.message.text,
        }
      );
      this.#view.getMyPost(ctx, post);
    }
  }
  async deletePost(ctx) {
    if (ctx.message.text === ctx.i18n.t("buttons.yes")) {
      await this.#postServices.deletePost(
        ctx.session.user.posts[ctx.session.post_iterator],
        ctx.from.id
      );
      const user = await this.#userServices.getUserByTgId(ctx.from.id);
      ctx.session.user = user;
      this.#view.successfullyRemoved(ctx);
    } else if (ctx.message.text === ctx.i18n.t("buttons.no")) {
      const post = await this.#postServices.getPostById(
        ctx.session.user.posts[ctx.session.post_iterator]
      );
      this.#view.getMyPost(ctx, post);
    } else if (ctx.message.text === ctx.i18n.t("buttons.mainMenu")) {
      this.#view.mainMenu(ctx);
    } else {
      this.#view.deletePost(ctx);
    }
  }
}

module.exports = {
  UserPostController,
};
