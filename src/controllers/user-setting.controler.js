const { View } = require("../../view/view");
const { Keyboards } = require("../keyboards/keyboard");

class UserSettingController {
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

  async userSetting(ctx) {
    if (ctx.message.text === ctx.i18n.t("buttons.back")) {
      this.#view.mainMenu(ctx);
    } else if (ctx.message.text === ctx.i18n.t("buttons.userName")) {
      this.#view.userSettingName(ctx);
    } else if (ctx.message.text === ctx.i18n.t("buttons.userNickname")) {
      this.#view.userSettingNickname(ctx);
    } else {
      this.#view.userSetting(ctx);
    }
  }

  async userSettingName(ctx) {
    if (ctx.message.text === ctx.i18n.t("buttons.back")) {
      this.#view.userSetting(ctx);
    } else if (ctx.message.text === ctx.i18n.t("buttons.mainMenu")) {
      this.#view.mainMenu(ctx);
    } else {
      const user = await this.#userServices.updateUser(ctx.from.id, {
        name: ctx.message.text,
      });
      this.#view.newUserName(ctx, user.name);
    }
  }

  async userSettingNickname(ctx) {
    if (ctx.message.text === ctx.i18n.t("buttons.back")) {
      this.#view.userSetting(ctx);
    } else if (ctx.message.text === ctx.i18n.t("buttons.mainMenu")) {
      this.#view.mainMenu(ctx);
    } else {
      const user = await this.#userServices.getUserByNickName(ctx.message.text);
      if (user) {
        return this.#view.nicknameTaken(ctx);
      }
      const newNickname = await this.#userServices.updateUser(ctx.from.id, {
        nickName: ctx.message.text,
      });
      this.#view.newNickname(ctx, newNickname.nickName);
    }
  }
}

module.exports = {
  UserSettingController,
};
