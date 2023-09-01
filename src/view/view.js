const { Keyboards } = require('../keyboards/keyboard');
const {
	createPostMessage,
	sendFormattedMessage,
	createCommentMessage,
	createUserMessage,
} = require('../reusable_functions/message_utils');

class View {
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

	async mainMenu(ctx) {
		const user = await this.#userServices.getUserByTgId(ctx.from.id);
		ctx.session.user = user;
		const userData = ctx.i18n
			.t('phrases.userData')
			.replace('$telegramId', user.telegramId)
			.replace('$userName', user.name)
			.replace('$userNickname', user.nickName)
			.replace('$userAge', user.age)
			.replace('$userSex', user.sex);
		ctx.reply(`${ctx.i18n.t('phrases.mainMenu')}\n\n${userData}`, this.#keyboards.mainMenu(ctx));
		ctx.scene.enter('mainMenu');
	}

	async userPost(ctx) {
		ctx.reply(ctx.i18n.t('phrases.userPost'), this.#keyboards.userPost(ctx));
		ctx.scene.enter('userPost');
	}

	async newPost(ctx) {
		ctx.reply(ctx.i18n.t('phrases.newPost'), this.#keyboards.backAndMainMenu(ctx));
		ctx.scene.enter('newPost');
	}

	async choosingHashtag(ctx) {
		ctx.reply(ctx.i18n.t('phrases.choosingHashtag'), this.#keyboards.choosingHashtag(ctx));
		ctx.scene.enter('choosingHashtag');
	}

	async postCreated(ctx, post) {
		let message = createPostMessage(ctx, post);
		ctx.reply(message, this.#keyboards.userPost(ctx));
		ctx.scene.enter('userPost');
	}

	async getMyPost(ctx, post) {
		const message = createPostMessage(ctx, post);
		const user = await this.#userServices.getUserByTgId(ctx.from.id);

		ctx.reply(ctx.i18n.t('phrases.getPost'), this.#keyboards.getMyPost(ctx));

		const keyboard =
			ctx.session.user.posts.length > 1
				? await this.#keyboards.myPostInline(ctx, user)
				: await this.#keyboards.myOnePostInline(ctx, user);

		await sendFormattedMessage(ctx, message, { reply_markup: keyboard });
		ctx.scene.enter('getMyPost');
	}

	async changeOfPost(ctx, post) {
		const message = createPostMessage(ctx, post);
		const user = await this.#userServices.getUserByTgId(ctx.from.id);
		const keyboard =
			ctx.session.user.posts.length > 1
				? await this.#keyboards.myPostInline(ctx, user)
				: await this.#keyboards.myOnePostInline(ctx, user);

		await ctx.editMessageText(message, { reply_markup: keyboard });
	}

	async getComments(ctx, comment, author) {
		const message = createCommentMessage(ctx, comment, author);
		const user = await this.#userServices.getUserByTgId(ctx.from.id);

		ctx.reply(ctx.i18n.t('phrases.getComment'), this.#keyboards.getMyComment(ctx));

		const keyboard =
			ctx.session.post.comments.length > 1
				? await this.#keyboards.myCommentInline(ctx, user)
				: await this.#keyboards.myOneCommentInline(ctx, user);

		await sendFormattedMessage(ctx, message, { reply_markup: keyboard });

		ctx.scene.enter('getUserPostComment');
	}

	async changeOfComment(ctx, comment, author) {
		const message = createCommentMessage(ctx, comment, author);
		const user = await this.#userServices.getUserByTgId(ctx.from.id);
		const keyboard =
			ctx.session.post.comments.length > 1
				? await this.#keyboards.myCommentInline(ctx, user)
				: await this.#keyboards.myOneCommentInline(ctx, user);

		await ctx.editMessageText(message, { reply_markup: keyboard });
	}

	async getAnotherUserPost(ctx, post) {
		const message = createPostMessage(ctx, post);
		const user = await this.#userServices.getUserByTgId(ctx.from.id);

		ctx.reply(ctx.i18n.t('phrases.getAnotherPost'), this.#keyboards.getUserPost(ctx));

		const keyboard =
			ctx.session.user.posts.length > 1
				? await this.#keyboards.myPostInline(ctx, user)
				: await this.#keyboards.myOnePostInline(ctx, user);

		await sendFormattedMessage(ctx, message, { reply_markup: keyboard });
		ctx.scene.enter('getAnotherUserPost');
	}

	async getAnotherUserComment(ctx, comment, author) {
		const message = createCommentMessage(ctx, comment, author);
		const user = await this.#userServices.getUserByTgId(ctx.from.id);
		ctx.reply(ctx.i18n.t('phrases.getComment'), this.#keyboards.backAndMainMenu(ctx));

		const keyboard =
			ctx.session.post.comments.length > 1
				? await this.#keyboards.myCommentInline(ctx, user)
				: await this.#keyboards.myOneCommentInline(ctx, user);

		await sendFormattedMessage(ctx, message, { reply_markup: keyboard });

		ctx.scene.enter('getAnotherUserComment');
	}

	notPost(ctx) {
		ctx.reply(ctx.i18n.t('phrases.notPost'));
	}

	notAnotherPost(ctx) {
		ctx.reply(ctx.i18n.t('phrases.notAnotherPost'));
	}

	notComment(ctx) {
		ctx.reply(ctx.i18n.t('phrases.notComment'));
	}

	updatePost(ctx) {
		ctx.reply(ctx.i18n.t('phrases.updatePost'), this.#keyboards.backAndMainMenu(ctx));
		ctx.scene.enter('updatePost');
	}

	deletePost(ctx) {
		ctx.reply(ctx.i18n.t('phrases.deletePost'), this.#keyboards.deletePost(ctx));
		ctx.scene.enter('deletePost');
	}

	successfullyRemoved(ctx) {
		ctx.reply(ctx.i18n.t('phrases.successfullyRemoved'), this.#keyboards.userPost(ctx));
		ctx.scene.enter('userPost');
	}

	updateHashtag(ctx) {
		if (ctx.session.post.hashtags.length === 0) {
			ctx.reply(ctx.i18n.t('phrases.updateHashtag'), this.#keyboards.updateHashtagNoHashtag(ctx));
		} else {
			ctx.reply(ctx.i18n.t('phrases.updateHashtag'), this.#keyboards.updateHashtag(ctx));
		}
		ctx.scene.enter('updateHashtag');
	}

	deleteHashtag(ctx) {
		ctx.reply(ctx.i18n.t('phrases.deleteHashtag'), this.#keyboards.deletePost(ctx));
		ctx.scene.enter('deleteHashtag');
	}

	deleteComment(ctx) {
		ctx.reply(ctx.i18n.t('phrases.deleteComment'), this.#keyboards.deletePost(ctx));
		ctx.scene.enter('deleteComment');
	}

	writeComment(ctx) {
		ctx.reply(ctx.i18n.t('phrases.writeComment'), this.#keyboards.backAndMainMenu(ctx));
		ctx.scene.enter('writeComment');
	}

	writeCommentAnotherUser(ctx) {
		ctx.reply(ctx.i18n.t('phrases.writeComment'), this.#keyboards.backAndMainMenu(ctx));
		ctx.scene.enter('writeCommentAnotherUser');
	}

	getAnotherUser(ctx) {
		ctx.reply(ctx.i18n.t('phrases.getAnotherUser'), this.#keyboards.getAnotherUser(ctx));
		ctx.scene.enter('getAnotherUser');
	}

	getUserByNickname(ctx) {
		ctx.reply(ctx.i18n.t('phrases.getUserByNickname'), this.#keyboards.backAndMainMenu(ctx));
		ctx.scene.enter('getUserByNickname');
	}

	nicknameNotFoundMessage(ctx) {
		ctx.reply(ctx.i18n.t('phrases.nicknameNotFoundMessage'), this.#keyboards.backAndMainMenu(ctx));
	}

	processUserByNickname(ctx, user) {
		const message = createUserMessage(ctx, user);

		ctx.reply(message, this.#keyboards.processUser(ctx));
		ctx.scene.enter('processUserByNickname');
	}

	deleteAnotherUserPostComment(ctx) {
		ctx.reply(ctx.i18n.t('phrases.deleteComment'), this.#keyboards.deletePost(ctx));
		ctx.scene.enter('deleteAnotherUserPostComment');
	}
}

module.exports = {
	View,
};
