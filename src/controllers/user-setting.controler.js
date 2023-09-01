const { View } = require('../view/view');
const { Keyboards } = require('../keyboards/keyboard');
const { UserSettingView } = require('../view/user-setting-view');

class UserSettingController {
	#userServices;
	#postServices;
	#commentServices;
	#view;
	#userSettingView;
	#keyboards;
	constructor(UserServices, PostServices, CommentServices) {
		this.#userServices = UserServices;
		this.#postServices = PostServices;
		this.#commentServices = CommentServices;
		this.#view = new View(UserServices, PostServices, CommentServices);
		this.#keyboards = new Keyboards();
		this.#userSettingView = new UserSettingView();
	}

	async userSetting(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#view.mainMenu(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.userName')) {
			this.#userSettingView.userSettingName(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.userNickname')) {
			this.#userSettingView.userSettingNickname(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.userAge')) {
			this.#userSettingView.userSettingAge(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.userSex')) {
			this.#userSettingView.userSettingSex(ctx);
		} else {
			this.#userSettingView.userSetting(ctx);
		}
	}

	async userSettingName(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#userSettingView.userSetting(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#view.mainMenu(ctx);
		} else {
			const user = await this.#userServices.updateUser(ctx.from.id, {
				name: ctx.message.text,
			});
			this.#userSettingView.newUserName(ctx, user.name);
		}
	}

	async userSettingNickname(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#userSettingView.userSetting(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#view.mainMenu(ctx);
		} else {
			const user = await this.#userServices.getUserByNickName(ctx.message.text);
			if (user) {
				return this.#userSettingView.nicknameTaken(ctx);
			}
			const newNickname = await this.#userServices.updateUser(ctx.from.id, {
				nickName: ctx.message.text,
			});
			this.#userSettingView.newNickname(ctx, newNickname.nickName);
		}
	}

	async userSettingAge(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#userSettingView.userSetting(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#view.mainMenu(ctx);
		} else {
			const age = parseInt(ctx.message.text);
			if (!age) {
				return this.#userSettingView.enterNumber(ctx);
			}
			const newAge = await this.#userServices.updateUser(ctx.from.id, {
				age: age,
			});
			this.#userSettingView.newAge(ctx, newAge.age);
		}
	}

	async userSettingSex(ctx) {
		const sex = new Set(['Мужчина', 'Женщина']);
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#userSettingView.userSetting(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#view.mainMenu(ctx);
		} else if (sex.has(ctx.message.text)) {
			const user = await this.#userServices.updateUser(ctx.from.id, {
				sex: ctx.message.text,
			});
			this.#userSettingView.newSex(ctx, ctx.message.text);
		} else {
			this.#userSettingView.userSettingSex(ctx);
		}
	}
}

module.exports = {
	UserSettingController,
};
