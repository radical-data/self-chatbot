import { MyConversation, MyContext, Tracker } from "./types";
import { homeMenu } from "./menus";
import { Keyboard } from "grammy";
import { trackerRangeKeyboard, trackerSampleTypeKeyboard } from "./keyboards";
import { error } from "console";

export async function add_tracker_conversation(
  conversation: MyConversation,
  ctx: MyContext
) {
  let tracker_name: string;
  let possible_values: Array<string>;
  let sample_type: "random" | "open";
  await ctx.reply(
    "Alright, a new tracker. How are we going to call it? Please choose a name for your tracker"
  );
  tracker_name = await conversation.form.text();
  ctx.reply(`Great, we'll track ${tracker_name.toLowerCase()}!`);
  await conversation.sleep(200);
  ctx.reply(`What possible values should we give for ${tracker_name}?`, {
    reply_markup: trackerRangeKeyboard,
  });
  let range_answer = await conversation.form.text();
  if (range_answer == "0-10 (a good default)") {
    possible_values = Array.from({ length: 11 }, (_, i) => i.toString());
  } else if (range_answer == "True or false") {
    possible_values = ["true", "false"];
  } else {
    possible_values = [];
  }
  ctx.reply(`Lovely. And what sample type should we use for ${tracker_name}?`, {
    reply_markup: trackerSampleTypeKeyboard,
  });
  let sample_type_answer = await conversation.form.text();
  if (sample_type_answer == "Random sampling") {
    sample_type = "random";
  } else {
    sample_type = "open";
  }
  let new_tracker: Tracker = {
    name: tracker_name,
    possible_values,
    sample_type,
  };
  ctx.reply(
    `Great, we've setup a new tracker called ${new_tracker.name} with a range of ${new_tracker.possible_values}. It will be recorded with ${new_tracker.sample_type} sampling.`
  );
  conversation.session.trackers = [
    ...conversation.session.trackers,
    new_tracker,
  ];
}
