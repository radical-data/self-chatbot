import { MyConversation, MyContext, Tracker } from "./types";
import { homeMenu } from "./menus";
import { Keyboard } from "grammy";

// async function add_tracker_conversation_2(
//   conversation: MyConversation,
//   ctx: MyContext
// ): Promise<Tracker>

const keyboard = new Keyboard()
  .text("0-10 (a good default)")
  .row()
  .text("True or false")
  .row()
  .text("Categories")
  .resized()
  .oneTime();

export async function add_tracker_conversation(
  conversation: MyConversation,
  ctx: MyContext
) {
  let tracker_name: string;
  let possible_values: Array<string>;
  await ctx.reply(
    "Alright, a new tracker. How are we going to call it? Please choose a name for your tracker"
  );
  tracker_name = await conversation.form.text();
  ctx.reply(`Great, we'll track ${tracker_name.toLowerCase()}!`);
  await conversation.sleep(200);
  ctx.reply(`What possible values should we give for ${tracker_name}?`, {
    reply_markup: keyboard,
  });
  let range_answer = await conversation.form.text();
  if (range_answer == "0-10 (a good default)") {
    possible_values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  } else if (range_answer == "True or false") {
    possible_values = ["true", "false"];
  } else {
    possible_values = [];
  }
  let new_tracker: Tracker = { name: tracker_name, possible_values };
  ctx.reply(
    `Great, we've setup a new tracker called ${new_tracker.name} with a range of ${new_tracker.possible_values}.`
  );
  conversation.session.trackers = [
    ...conversation.session.trackers,
    new_tracker,
  ];
}
