const { Keyboards } = require('../keyboards/keyboard');
const {
	createPostMessage,
	sendFormattedMessage,
	createCommentMessage,
	createUserMessage,
} = require('../reusable_functions/message_utils');

class UserPostView {
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

	updatePost(ctx) {
		ctx.reply(ctx.i18n.t('phrases.updatePost'), this.#keyboards.backAndMainMenu(ctx));
		ctx.scene.enter('updatePost');
	}

	deletePost(ctx) {
		ctx.reply(ctx.i18n.t('phrases.deletePost'), this.#keyboards.deletePost(ctx));
		ctx.scene.enter('deletePost');
	}

	writeComment(ctx) {
		ctx.reply(ctx.i18n.t('phrases.writeComment'), this.#keyboards.backAndMainMenu(ctx));
		ctx.scene.enter('writeComment');
	}

	deleteComment(ctx) {
		ctx.reply(ctx.i18n.t('phrases.deleteComment'), this.#keyboards.deletePost(ctx));
		ctx.scene.enter('deleteComment');
	}

	successfullyRemoved(ctx) {
		ctx.reply(ctx.i18n.t('phrases.successfullyRemoved'), this.#keyboards.userPost(ctx));
		ctx.scene.enter('userPost');
	}

	deleteHashtag(ctx) {
		ctx.reply(ctx.i18n.t('phrases.deleteHashtag'), this.#keyboards.deletePost(ctx));
		ctx.scene.enter('deleteHashtag');
	}

	updateHashtag(ctx) {
		const keyboard = !ctx.session.post.hashtags.length
			? this.#keyboards.updateHashtagNoHashtag(ctx)
			: this.#keyboards.updateHashtag(ctx);

		ctx.reply(ctx.i18n.t('phrases.updateHashtag'), keyboard);
		ctx.scene.enter('updateHashtag');
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
}

module.exports = {
	UserPostView,
};
