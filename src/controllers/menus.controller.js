const { View } = require("../../view/view");
const { Keyboards } = require("../keyboards/keyboard");

class MenusController {
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

  async mainMenu(ctx) {
    if (ctx.message.text === ctx.i18n.t("buttons.userSetting")) {
      this.#view.userSetting(ctx);
    } else {
      this.#view.mainMenu(ctx);
    }
  }
}

module.exports = {
  MenusController,
};
