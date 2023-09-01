const { View } = require('../view/view');
const { Keyboards } = require('../keyboards/keyboard');
const { UserSettingView } = require('../view/user-setting-view');

class MenusController {
	#userServices;
	#postServices;
	#commentServices;
	#view;
	#userSettingView;
	#keyboard;
	constructor(UserServices, PostServices, CommentServices) {
		this.#userServices = UserServices;
		this.#postServices = PostServices;
		this.#commentServices = CommentServices;
		this.#view = new View(UserServices, PostServices, CommentServices);
		this.#userSettingView = new UserSettingView(UserServices, PostServices, CommentServices);
		this.#keyboard = new Keyboards();
	}

	async mainMenu(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.userSetting')) {
			this.#userSettingView.userSetting(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.userPost')) {
			this.#view.userPost(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.getAnotherUser')) {
			this.#view.getAnotherUser(ctx);
		} else {
			this.#view.mainMenu(ctx);
		}
	}

	async helpView(ctx) {
		ctx.reply(ctx.i18n.t('phrases.help'), this.#keyboard.mainMenu(ctx));
		ctx.scene.enter('mainMenu');
	}

	async userSettingView(ctx) {
		this.#userSettingView.userSetting(ctx);
	}
}

module.exports = {
	MenusController,
};
