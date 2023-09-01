const { View } = require('../view/view');
const { NameUserView } = require('../view/name-user-view');
const { Keyboards } = require('../keyboards/keyboard');
const { NicknameUserView } = require('../view/nickname-user-view');

class GetAnotherUserController {
	#userServices;
	#postServices;
	#commentServices;
	#view;
	#nickNameUserView;
	#keyboards;
	#nameUserView;
	constructor(UserServices, PostServices, CommentServices) {
		this.#userServices = UserServices;
		this.#postServices = PostServices;
		this.#commentServices = CommentServices;
		this.#view = new View(UserServices, PostServices, CommentServices);
		this.#keyboards = new Keyboards();
		this.#nameUserView = new NameUserView(UserServices, PostServices, CommentServices);
		this.#nickNameUserView = new NicknameUserView(UserServices, PostServices, CommentServices);
	}

	getAnotherUser(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.getUserByNickname')) {
			this.#nickNameUserView.getUserByNickname(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#view.mainMenu(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.getUsersByName')) {
			this.#nameUserView.getUserByName(ctx);
		}
	}
}

module.exports = {
	GetAnotherUserController,
};
