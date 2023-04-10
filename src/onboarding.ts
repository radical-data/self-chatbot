import { MyConversation, MyContext } from "./types";
import { homeMenu } from "./menus";

export async function onboarding_conversation(
  conversation: MyConversation,
  ctx: MyContext
) {
  ctx.reply(
    `Welcome to Self ${ctx.from?.first_name}!` +
      ctx.emoji`${"waving_hand_medium_skin_tone"}`
  );
  await conversation.sleep(2000);
  await ctx.reply(
    "Self is a chatbot to support learning about our bodies through data."
  );
  await conversation.sleep(2000);
  await ctx.reply("Let's get started:", {
    reply_markup: homeMenu,
  });
}

// await ctx.reply("To start, we need to choose at least one thing to track.");
// await conversation.sleep(2000);
// await ctx.reply("This could be anything:");
// await conversation.sleep(1000);
// await ctx.reply("• Your mood");
// await conversation.sleep(750);
// await ctx.reply("• Your stress level");
// await conversation.sleep(750);
// await ctx.reply("• The intensity of a chronic pain...");
// await conversation.sleep(1500);

// await ctx.reply("What would you like to track?");
// const initial_tracker = await conversation.form.text();
// if (!developer) {
//   ctx.reply(
//     `Great, we'll start by tracking ${initial_tracker.toLowerCase()}!`
//   );
//   await conversation.sleep(2000);
//   // ctx.reply(`What possible values should we give for ${initial_tracker}?`);
//   ctx.reply(
//     `For now, we'll create the possible options for ${initial_tracker.toLowerCase()} as the numbers 0-10.`
//   );
//   await conversation.sleep(2000);
//   ctx.reply(
//     "This is a standard in psychological research and is a good default."
//   );
// }
// let new_tracker: Tracker = {
//   name: initial_tracker,
//   possible_values: Array.from(Array(11), (x, i) => String(i)),
// };
// conversation.session.trackers.push(new_tracker);
// if (!developer) {
//   await conversation.sleep(1000);
//   ctx.reply("To gather data, Self uses experience sampling.");
//   await conversation.sleep(2000);
//   ctx.reply("It's pretty simple.");
//   await conversation.sleep(750);
//   ctx.reply(
//     `Instead of relying on you to add details about ${initial_tracker} whenever you remember, Self will prompt you at random times of the day.`
//   );
//   await conversation.sleep(4000);
//   ctx.reply(
//     `It's a standard in psychological research because it gives a more representative sample of your experience of life.`
//   );
//   await conversation.sleep(3000);
//   ctx.reply(
//     `We thought it would be great to make experience sampling, and other techniques for learning about our bodies, easily accessible for everyone.`
//   );
//   await conversation.sleep(4000);
//   ctx.reply(
//     `So thanks for joining us here on Self, our experiment in experimenting!`
//   );
// }
// if (!conversation.session.experience_sampling_running) {
//   waitThenRespond(ctx);
//   conversation.session.experience_sampling_running = true;
//   ctx.reply(
//     "Experience sampling is now running. You will be prompted 4 times each day."
//   );
// } else {
//   ctx.reply(
//     "Experience sampling was already running. You will be prompted 4 times each day."
//   );
// }
