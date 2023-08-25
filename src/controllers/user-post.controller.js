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
      ctx.session.iterator = 0;
      const post = await this.#postServices.getPostById(
        ctx.session.user.posts[0]
      );
      if (!post) {
        return this.#view.notPost(ctx);
      }
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

  async getMyPost(cxt) {}

  async getMyPostInline(ctx) {
    // console.log(ctx.update.callback_query.data);
    // console.log("ctx.update :>> ", ctx.update);
    // console.log(ctx.session.user.posts.length);
    if (parseInt(ctx.update.callback_query.data) < 0) {
      ctx.session.iterator = ctx.session.user.posts.length - 1;
    } else if (
      parseInt(ctx.update.callback_query.data) === ctx.session.user.posts.length
    ) {
      ctx.session.iterator = 0;
    } else {
      ctx.session.iterator = ctx.update.callback_query.data;
    }
    console.log(ctx.session.iterator);
    const post = await this.#postServices.getPostById(
      ctx.session.user.posts[ctx.session.iterator]
    );

    this.#view.changeOfPost(ctx, post);
  }
}

module.exports = {
  UserPostController,
};
