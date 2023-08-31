function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getHashtagsText(hashtags) {
  return hashtags.length > 0 ? hashtags.join(", ") : "Отсутствуют";
}

function createCommentMessage(ctx, comment, author) {
  return ctx.i18n
    .t("phrases.comment")
    .replace("$content", comment.content)
    .replace("$likes", comment.numberOfLikes)
    .replace("$author", author.nickName)
    .replace("$dateCreate", formatDate(comment.dateOfCreate));
}

function createPostMessage(ctx, post) {
  return ctx.i18n
    .t("phrases.post")
    .replace("$content", post.content)
    .replace("$likes", post.numberOfLikes)
    .replace("$comment", post.comments.length)
    .replace("$dateCreate", formatDate(post.dateOfCreation))
    .replace("$hashtags", getHashtagsText(post.hashtags));
}

async function sendFormattedMessage(ctx, message, keyboard) {
  const sentMessage = await ctx.reply(message, keyboard);
  ctx.deleteMessage(ctx.session.message_id);
  ctx.session.message_id = sentMessage.message_id;
}

module.exports = {
  createPostMessage,
  sendFormattedMessage,
  createCommentMessage,
};
