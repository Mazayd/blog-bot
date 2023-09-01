const { Markup } = require('telegraf');
const i18n = require('i18n');
const {
	createLikeButton,
	createNavigationButtons,
	createDeleteButton,
} = require('../reusable_functions/button_helpers');

class Keyboards {
	mainMenu(ctx) {
		return Markup.keyboard([
			[ctx.i18n.t('buttons.userSetting'), ctx.i18n.t('buttons.userPost')],
			[ctx.i18n.t('buttons.getAnotherUser')],
		])
			.resize()
			.extra();
	}

	choiceSex(ctx) {
		return Markup.keyboard([[ctx.i18n.t('buttons.men'), ctx.i18n.t('buttons.women')]])
			.resize()
			.extra();
	}

	backAndMainMenu(ctx) {
		return Markup.keyboard([[ctx.i18n.t('buttons.mainMenu'), ctx.i18n.t('buttons.back')]])
			.resize()
			.extra();
	}

	userSetting(ctx) {
		return Markup.keyboard([
			[ctx.i18n.t('buttons.back')],
			[ctx.i18n.t('buttons.userName'), ctx.i18n.t('buttons.userNickname')],
			[ctx.i18n.t('buttons.userAge'), ctx.i18n.t('buttons.userSex')],
		])
			.resize()
			.extra();
	}

	userSettingSex(ctx) {
		return Markup.keyboard([
			[ctx.i18n.t('buttons.mainMenu'), ctx.i18n.t('buttons.back')],
			[ctx.i18n.t('buttons.men'), ctx.i18n.t('buttons.women')],
		])
			.resize()
			.extra();
	}

	userPost(ctx) {
		return Markup.keyboard([
			[ctx.i18n.t('buttons.back')],
			[ctx.i18n.t('buttons.newPost'), ctx.i18n.t('buttons.getPost')],
		])
			.resize()
			.extra();
	}

	choosingHashtag(ctx) {
		return Markup.keyboard([[ctx.i18n.t('buttons.skip')]])
			.resize()
			.extra();
	}

	getMyPost(ctx) {
		return Markup.keyboard([
			[ctx.i18n.t('buttons.back'), ctx.i18n.t('buttons.writeComment')],
			[ctx.i18n.t('buttons.getComments'), ctx.i18n.t('buttons.updatePost')],
			[ctx.i18n.t('buttons.deletePost'), ctx.i18n.t('buttons.updateHashtag')],
		])
			.resize()
			.extra();
	}

	getMyComment(ctx) {
		return Markup.keyboard([[ctx.i18n.t('buttons.back')], [ctx.i18n.t('buttons.deleteComment')]])
			.resize()
			.extra();
	}

	async myPostInline(ctx, user) {
		const likedByUser = ctx.session.post.likes.includes(user._id);

		const navigationButtons = createNavigationButtons(ctx.session.post_iterator, ctx.session.user.posts.length);

		const replyMarkup = {
			inline_keyboard: [[createLikeButton(likedByUser)], navigationButtons],
		};

		return replyMarkup;
	}

	myOnePostInline(ctx, user) {
		const likedByUser = ctx.session.post.likes.includes(user._id);

		const replyMarkup = {
			inline_keyboard: [[createLikeButton(likedByUser)]],
		};

		return replyMarkup;
	}

	myOneCommentInline(ctx, user) {
		const likedByUser = ctx.session.comment.likes.includes(user._id);

		const replyMarkup = {
			inline_keyboard: [[createLikeButton(likedByUser)]],
		};

		return replyMarkup;
	}

	myCommentInline(ctx, user) {
		const likedByUser = ctx.session.comment.likes.includes(user._id);

		const navigationButtons = createNavigationButtons(ctx.session.comment_iterator, ctx.session.post.comments.length);

		const replyMarkup = {
			inline_keyboard: [
				[createLikeButton(likedByUser)],
				navigationButtons,
				user._id === ctx.session.comment.user && user._id !== ctx.session.post.user ? [createDeleteButton()] : [],
			],
		};

		return replyMarkup;
	}

	userInline(ctx) {
		const navigationButtons = createNavigationButtons(ctx.session.user_iterator, ctx.session.users_list.length);

		const replyMarkup = {
			inline_keyboard: [navigationButtons],
		};

		return replyMarkup;
	}

	deletePost(ctx) {
		return Markup.keyboard([[ctx.i18n.t('buttons.mainMenu')], [ctx.i18n.t('buttons.yes'), ctx.i18n.t('buttons.no')]])
			.resize()
			.extra();
	}

	updateHashtag(ctx) {
		return Markup.keyboard([
			[ctx.i18n.t('buttons.mainMenu'), ctx.i18n.t('buttons.back')],
			[ctx.i18n.t('buttons.deleteHashtag')],
		])
			.resize()
			.extra();
	}

	updateHashtagNoHashtag(ctx) {
		return Markup.keyboard([[ctx.i18n.t('buttons.mainMenu'), ctx.i18n.t('buttons.back')]])
			.resize()
			.extra();
	}

	getAnotherUser(ctx) {
		return Markup.keyboard([
			[ctx.i18n.t('buttons.back')],
			[ctx.i18n.t('buttons.getUserByNickname'), ctx.i18n.t('buttons.getUsersByName')],
		])
			.resize()
			.extra();
	}

	processUser(ctx) {
		return Markup.keyboard([
			[ctx.i18n.t('buttons.back'), ctx.i18n.t('buttons.mainMenu')],
			[ctx.i18n.t('buttons.getPostAnotherUser')],
		])
			.resize()
			.extra();
	}

	getUserPost(ctx) {
		return Markup.keyboard([
			[ctx.i18n.t('buttons.back'), ctx.i18n.t('buttons.mainMenu')],
			[ctx.i18n.t('buttons.getComments'), ctx.i18n.t('buttons.writeComment')],
		])
			.resize()
			.extra();
	}
}

module.exports = {
	Keyboards,
};
