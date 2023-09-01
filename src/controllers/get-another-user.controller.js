const { CommonView } = require('../view/common-views');
const { NameUserView } = require('../view/name-user-view');
const { Keyboards } = require('../keyboards/keyboard');
const { NicknameUserView } = require('../view/nickname-user-view');

class GetAnotherUserController {
	#userServices;
	#postServices;
	#commentServices;
	#CommonView;
	#nickNameUserView;
	#keyboards;
	#nameUserView;
	constructor(UserServices, PostServices, CommentServices) {
		this.#userServices = UserServices;
		this.#postServices = PostServices;
		this.#commentServices = CommentServices;
		this.#CommonView = new CommonView(UserServices, PostServices, CommentServices);
		this.#keyboards = new Keyboards();
		this.#nameUserView = new NameUserView(UserServices, PostServices, CommentServices);
		this.#nickNameUserView = new NicknameUserView(UserServices, PostServices, CommentServices);
	}

	getAnotherUser(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.getUserByNickname')) {
			this.#nickNameUserView.getUserByNickname(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#CommonView.mainMenu(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.getUsersByName')) {
			this.#nameUserView.getUserByName(ctx);
		}
	}
}

module.exports = {
	GetAnotherUserController,
};
