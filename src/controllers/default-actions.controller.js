const UserServices = require("blog-api-lib/services/UserServices");
const { View } = require("../../view/view");
class DefaultActionController {
  #userServices;
  #postServices;
  #commentServices;
  #view;
  constructor(UserServices, PostServices, CommentServices) {
    this.#userServices = UserServices;
    this.#postServices = PostServices;
    this.#commentServices = CommentServices;
    this.#view = new View(UserServices, PostServices, CommentServices);
  }

  async noScenesReply(ctx) {
    const user = await this.#userServices.getUserByTgId(ctx.from.id);
    console.log("user: ", user);
    if (!user) {
      this.#view.firstChoiceNicknameView(ctx);
    } else {
      const userData = ctx.i18n
        .t("phrases.userData")
        .replace("$telegramId", user.telegramId)
        .replace("$userName", user.name)
        .replace("$userNickname", user, nickName);
      if (!user.age) {
        userData.replace("$userAge", "");
      }
    }
  }
}

module.exports = {
  DefaultActionController,
};
