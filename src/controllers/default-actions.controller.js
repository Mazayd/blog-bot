const UserServices = require("blog-api-lib/services/UserServices");
const { View } = require("../../view/view");
const { Keyboards } = require("../keyboards/keyboard");
class DefaultActionController {
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

  async startReply(ctx) {
    const user = await this.#userServices.getUserByTgId(ctx.from.id);
    console.log("user: ", user);
    if (!user) {
      this.#view.firstChoiceNicknameView(ctx);
    } else {
      const userData = ctx.i18n
        .t("phrases.userData")
        .replace("$telegramId", user.telegramId)
        .replace("$userName", user.name)
        .replace("$userNickname", user.nickName)
        .replace("$userAge", user.age)
        .replace("$userSex", user.sex);
      ctx.reply(
        `${ctx.i18n.t("phrases.mainMenu")}\n\n${userData}`,
        this.#keyboard.mainMenu(ctx)
      );
      ctx.scene.enter("mainMenu");
    }
  }
}

module.exports = {
  DefaultActionController,
};
