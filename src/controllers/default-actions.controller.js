const UserServices = require("blog-api-lib/services/UserServices");
const ChoiceNicknameController = require("./choice-nickname.controller");
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
      this.#view.firstChoiseNicknameView(ctx);
    }
  }
}

module.exports = {
  DefaultActionController,
};
