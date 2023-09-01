const { Keyboards } = require('../keyboards/keyboard');

class UserSettingView {
	#userServices;
	#postServices;
	#commentServices;
	#keyboards;
	constructor(UserServices, PostServices, CommentServices) {
		this.#userServices = UserServices;
		this.#postServices = PostServices;
		this.#commentServices = CommentServices;
		this.#keyboards = new Keyboards();
	}

	async userSetting(ctx) {
		ctx.reply(ctx.i18n.t('phrases.userSetting'), this.#keyboards.userSetting(ctx));
		ctx.scene.enter('userSetting');
	}

	async userSettingName(ctx) {
		ctx.reply(ctx.i18n.t('phrases.userSettingName'), this.#keyboards.backAndMainMenu(ctx));
		ctx.scene.enter('userSettingName');
	}

	async userSettingNickname(ctx) {
		ctx.reply(ctx.i18n.t('phrases.userSettingNickname'), this.#keyboards.backAndMainMenu(ctx));
		ctx.scene.enter('userSettingNickname');
	}

	async userSettingAge(ctx) {
		ctx.reply(ctx.i18n.t('phrases.userSettingAge'), this.#keyboards.backAndMainMenu(ctx));
		ctx.scene.enter('userSettingAge');
	}

	async userSettingSex(ctx) {
		ctx.reply(ctx.i18n.t('phrases.userSettingSex'), this.#keyboards.userSettingSex(ctx));
		ctx.scene.enter('userSettingSex');
	}

	async newUserName(ctx, name) {
		ctx.reply(ctx.i18n.t('phrases.newUserName').replace('$userName', name), this.#keyboards.backAndMainMenu(ctx));
	}

	async nicknameTaken(ctx) {
		ctx.reply(ctx.i18n.t('phrases.busyNickname'), this.#keyboards.backAndMainMenu(ctx));
	}

	async enterNumber(ctx) {
		ctx.reply(ctx.i18n.t('phrases.enterNumber'), this.#keyboards.backAndMainMenu(ctx));
	}

	async newAge(ctx, age) {
		ctx.reply(ctx.i18n.t('phrases.newUserAge').replace('$userAge', age), this.#keyboards.backAndMainMenu(ctx));
	}

	async newSex(ctx, sex) {
		ctx.reply(ctx.i18n.t('phrases.newUserSex').replace('$userSex', sex));
	}

	async newNickname(ctx, nickname) {
		ctx.reply(
			ctx.i18n.t('phrases.newUserNickname').replace('$userNickname', nickname),
			this.#keyboards.backAndMainMenu(ctx)
		);
	}
}

module.exports = {
	UserSettingView,
};
