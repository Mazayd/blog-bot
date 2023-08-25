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
}

module.exports = {
  UserPostController,
};
