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
      [ctx.i18n.t("buttons.getComments")],
    ])
      .resize()
      .extra();
  }

  getMyComment(ctx) {
    return Markup.keyboard([[ctx.i18n.t("buttons.back")]])
      .resize()
      .extra();
  }

  myPostInline(ctx) {
    const replyMarkup = {
      inline_keyboard: [
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
    const replyMarkup = {
      inline_keyboard: [
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
}

module.exports = {
  Keyboards,
};
