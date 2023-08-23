const { View } = require("../../view/view");
const { Keyboards } = require("../keyboards/keyboard");

class UserSettingController {
  #userServices;
  #postServices;
  #commentServices;
  #view;
  #keyboard;
  constructor(UserServices, PostServices, CommentServices) {
    this.#userServices = UserServices;
    this.#postServices = PostServices;
    this.#commentServices = CommentServices;
    this.#view = new View(UserServices, PostServices, CommentServices);
    this.#keyboard = new Keyboards();
  }

  async userSetting(ctx) {
    if (ctx.message.text === ctx.i18n.t("buttons.back")) {
      this.#view.mainMenu(ctx);
    } else if (ctx.message.text === ctx.i18n.t("buttons.userName")) {
      this.#view.userSettingName(ctx);
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
      await this.#userServices.updateUser(ctx.from.id, {
        name: ctx.message.text,
      });
      this.#view.mainMenu(ctx);
    }
  }
}

module.exports = {
  UserSettingController,
};
