const { Markup } = require("telegraf");
const i18n = require("i18n");

class Keyboards {
  mainMenu(ctx) {
    return Markup.keyboard([
      [ctx.i18n.t("buttons.userSetting"), ctx.i18n.t("buttons.userPost")],
    ])
      .resize()
      .extra();
  }

  choiceSex(ctx) {
    return Markup.keyboard([
      [ctx.i18n.t("buttons.men"), ctx.i18n.t("buttons.women")],
    ])
      .resize()
      .extra();
  }

  backAndMainMenu(ctx) {
    return Markup.keyboard([
      [ctx.i18n.t("buttons.mainMenu"), ctx.i18n.t("buttons.back")],
    ])
      .resize()
      .extra();
  }

  userSetting(ctx) {
    return Markup.keyboard([
      [ctx.i18n.t("buttons.back")],
      [ctx.i18n.t("buttons.userName"), ctx.i18n.t("buttons.userNickname")],
      [ctx.i18n.t("buttons.userAge"), ctx.i18n.t("buttons.userSex")],
    ])
      .resize()
      .extra();
  }

  userSettingSex(ctx) {
    return Markup.keyboard([
      [ctx.i18n.t("buttons.mainMenu"), ctx.i18n.t("buttons.back")],
      [ctx.i18n.t("buttons.men"), ctx.i18n.t("buttons.women")],
    ])
      .resize()
      .extra();
  }

  userPost(ctx) {
    return Markup.keyboard([
      [ctx.i18n.t("buttons.back")],
      [ctx.i18n.t("buttons.newPost"), ctx.i18n.t("buttons.getPost")],
    ])
      .resize()
      .extra();
  }

  choosingHashtag(ctx) {
    return Markup.keyboard([[ctx.i18n.t("buttons.skip")]])
      .resize()
      .extra();
  }

  getMyPost(ctx) {
    return Markup.keyboard([
      [ctx.i18n.t("buttons.back")],
      [ctx.i18n.t("buttons.getComments"), ctx.i18n.t("buttons.updatePost")],
      [ctx.i18n.t("buttons.deletePost"), ctx.i18n.t("buttons.updateHashtag")],
    ])
      .resize()
      .extra();
  }

  getMyComment(ctx) {
    return Markup.keyboard([
      [ctx.i18n.t("buttons.back")],
      [ctx.i18n.t("buttons.deleteComment")],
    ])
      .resize()
      .extra();
  }

  myPostInline(ctx) {
    const likeInlineKeyboard = {
      text: ctx.session.post.likes.find((item) => item === ctx.session.user._id)
        ? "❤️"
        : "🖤",
      callback_data: ctx.session.post.likes.find(
        (item) => item === ctx.session.user._id
      )
        ? "❤️"
        : "🖤",
    };

    const replyMarkup = {
      inline_keyboard: [
        [likeInlineKeyboard],
        [
          {
            text: "⏪",
            callback_data: parseInt(ctx.session.post_iterator) - 1,
          },
          {
            text: `${parseInt(ctx.session.post_iterator) + 1} c ${
              ctx.session.user.posts.length
            }`,
            callback_data: parseInt(ctx.session.post_iterator),
          },
          {
            text: "⏩",
            callback_data: parseInt(ctx.session.post_iterator) + 1,
          },
        ],
      ],
    };
    return replyMarkup;
  }

  myCommentInline(ctx) {
    const likeInlineKeyboard = {
      text: ctx.session.comment.likes.find(
        (item) => item === ctx.session.user._id
      )
        ? "❤️"
        : "🖤",
      callback_data: ctx.session.comment.likes.find(
        (item) => item === ctx.session.user._id
      )
        ? "❤️"
        : "🖤",
    };
    const replyMarkup = {
      inline_keyboard: [
        [likeInlineKeyboard],
        [
          {
            text: "⏪",
            callback_data: `${parseInt(ctx.session.comment_iterator) - 1}`,
          },
          {
            text: `${parseInt(ctx.session.comment_iterator) + 1} c ${
              ctx.session.post.comments.length
            }`,
            callback_data: `${parseInt(ctx.session.comment_iterator)}`,
          },
          {
            text: "⏩",
            callback_data: `${parseInt(ctx.session.comment_iterator) + 1}`,
          },
        ],
      ],
    };
    return replyMarkup;
  }

  deletePost(ctx) {
    return Markup.keyboard([
      [ctx.i18n.t("buttons.mainMenu")],
      [ctx.i18n.t("buttons.yes"), ctx.i18n.t("buttons.no")],
    ])
      .resize()
      .extra();
  }
  updateHashtag(ctx) {
    return Markup.keyboard([
      [ctx.i18n.t("buttons.mainMenu"), ctx.i18n.t("buttons.back")],
      [ctx.i18n.t("buttons.deleteHashtag")],
    ])
      .resize()
      .extra();
  }
  updateHashtagNoHashtag(ctx) {
    return Markup.keyboard([
      [ctx.i18n.t("buttons.mainMenu"), ctx.i18n.t("buttons.back")],
    ])
      .resize()
      .extra();
  }
}

module.exports = {
  Keyboards,
};
