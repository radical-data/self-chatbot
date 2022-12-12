import { Bot, session, InlineKeyboard } from "grammy";
import { emojiParser } from "@grammyjs/emoji";
import { BOT_TOKEN } from "./config";
import { Menu, MenuRange } from "@grammyjs/menu";
import {
  Tracker,
  Prompt,
  SessionData,
  MyContext,
  MyConversation,
} from "./types";
import { exportData } from "./exportData";
import { random_times, random_time } from "./experience_sampling_times";
import { conversations, createConversation } from "@grammyjs/conversations";

let developer: boolean = false;

const bot = new Bot<MyContext>(BOT_TOKEN);

// const now = new Date();
// const inTenSeconds = new Date(now.getTime() + 10 * 1000);
// const inOneMinute = new Date(now.getTime() + 60 * 1000);
// const inFiveMinutes = new Date(now.getTime() + 5 * 60 * 1000);

// let prompts = [now, inTenSeconds, inOneMinute, inFiveMinutes];

function initial(): SessionData {
  return {
    trackers: [],
    prompts: random_times(new Date(), 4).map(function (a) {
      return { time: a };
    }),
    // prompts: prompts.map(function (a) {
    //   return { time: a };
    // }),
    readings: [],
    experience_sampling_running: false,
  };
}
bot.use(session({ initial }));
bot.use(emojiParser());
bot.use(conversations());
bot.api.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "show_trackers", description: "Show all trackers" },
  {
    command: "start_experience_sampling",
    description: "Start experience sampling",
  },
  {
    command: "stop_experience_sampling",
    description: "Stop experience sampling",
  },
  {
    command: "experience_sampling_status",
    description: "See if experience sampling is running",
  },
  // { command: "track", description: "Take a reading of all your trackers" },
  // { command: "add_tracker", description: "Add a new thing to track" },
  // { command: "remove_tracker", description: "Remove a single tracker" },
  { command: "about", description: "Show about text" },
  { command: "export", description: "Export all data" },
]);

const trackerValuesMenu = new Menu<MyContext>("dynamic");
trackerValuesMenu.dynamic((ctx, range) => {
  for (const i of ctx.session.trackers[0].possible_values) {
    range
      .text(i.toString(), (ctx) => {
        ctx.reply(`You chose ${i} for ${ctx.session.trackers[0].name}.`);
        ctx.session.readings.push({
          time: new Date(),
          tracker_name: ctx.session.trackers[0].name,
          value: i,
        });
        setTimeout(() => ctx.reply("See you at the next check-in!"), 1500);
      })
      .row();
  }
});

bot.use(trackerValuesMenu);

const trackersMenu = new Menu<MyContext>("dynamic");
trackersMenu.dynamic((ctx, range) => {
  for (const tracker of ctx.session.trackers) {
    range
      .text(tracker.name.toString(), (ctx) =>
        ctx.reply(`You chose ${tracker.name.toString()}`)
      )
      .row();
  }
});

bot.use(trackersMenu);

async function initial_tracker(conversation: MyConversation, ctx: MyContext) {
  if (!developer) {
    ctx.reply(
      `Welcome to Qself ${ctx.from?.first_name}!` +
        ctx.emoji`${"waving_hand_medium_skin_tone"}`
    );
    await conversation.sleep(2000);
    await ctx.reply(
      "Qself is a chatbot to support learning about our bodies through data."
    );
    await conversation.sleep(2000);
    await ctx.reply("To start, we need to choose at least one thing to track.");
    await conversation.sleep(2000);
    await ctx.reply("This could be anything:");
    await conversation.sleep(1000);
    await ctx.reply("• Your mood");
    await conversation.sleep(750);
    await ctx.reply("• Your stress level");
    await conversation.sleep(750);
    await ctx.reply("• The intensity of a chronic pain...");
    await conversation.sleep(1500);
  }
  await ctx.reply("What would you like to track?");
  const initial_tracker = await conversation.form.text();
  if (!developer) {
    ctx.reply(
      `Great, we'll start by tracking ${initial_tracker.toLowerCase()}!`
    );
    await conversation.sleep(2000);
    // ctx.reply(`What possible values should we give for ${initial_tracker}?`);
    ctx.reply(
      `For now, we'll create the possible options for ${initial_tracker.toLowerCase()} as the numbers 0-10.`
    );
    await conversation.sleep(2000);
    ctx.reply(
      "This is a standard in psychological research and is a good default."
    );
  }
  let new_tracker: Tracker = {
    name: initial_tracker,
    possible_values: Array.from(Array(11), (x, i) => String(i)),
  };
  conversation.session.trackers.push(new_tracker);
  if (!developer) {
    await conversation.sleep(1000);
    ctx.reply("To gather data, Qself uses experience sampling.");
    await conversation.sleep(2000);
    ctx.reply("It's pretty simple.");
    await conversation.sleep(750);
    ctx.reply(
      `Instead of relying on you to add details about ${initial_tracker} whenever you remember, Qself will prompt you at random times of the day.`
    );
    await conversation.sleep(4000);
    ctx.reply(
      `It's a standard in psychological research because it gives a more representative sample of your experience of life.`
    );
    await conversation.sleep(3000);
    ctx.reply(
      `We thought it would be great to make experience sampling, and other techniques for learning about our bodies, easily accessible for everyone.`
    );
    await conversation.sleep(4000);
    ctx.reply(
      `So thanks for joining us here on Qself, our experiment in experimenting!`
    );
  }
  if (!conversation.session.experience_sampling_running) {
    waitThenRespond(ctx);
    conversation.session.experience_sampling_running = true;
    ctx.reply(
      "Experience sampling is now running. You will be prompted 4 times each day."
    );
  } else {
    ctx.reply(
      "Experience sampling was already running. You will be prompted 4 times each day."
    );
  }
}

bot.use(createConversation(initial_tracker));

bot.command("start", async (ctx) => {
  await ctx.conversation.enter("initial_tracker");
});

bot.command("start_experience_sampling", (ctx) => {
  if (ctx.session.experience_sampling_running) {
    ctx.reply("Experience sampling is already running!");
  } else {
    waitThenRespond(ctx);
    ctx.reply("Experience sampling is now running!");
    ctx.session.experience_sampling_running = true;
  }
});

bot.command("stop_experience_sampling", (ctx) => {
  if (ctx.session.experience_sampling_running) {
    ctx.session.experience_sampling_running = false;
    ctx.reply("You have stopped experience sampling.");
  } else {
    ctx.reply("Experience sampling is already stopped!");
  }
});

bot.command("export", (ctx) => exportData(ctx));

bot.command("random_times", (ctx) =>
  ctx.reply(JSON.stringify(random_times(new Date(), 4)))
);

const aboutKeyboard = new InlineKeyboard()
  .url("Visit the Qself website", "https://qself.app")
  .row()
  .url("Check out the code", "https://github.com/radical_data/qself");

bot.command("about", (ctx) => {
  ctx.reply("Qself Bot is a chatbot built by Radical Data and Odd Studio.", {
    reply_markup: aboutKeyboard,
  });
});
bot.command("add_tracker", (ctx) => {
  let new_tracker: Tracker = {
    name: ctx.match,
    possible_values: Array.from(Array(10), (x, i) => String(i)),
  };
  ctx.session.trackers.push(new_tracker);
});
bot.command("remove_tracker", (ctx) => {
  ctx.session.trackers = ctx.session.trackers.filter(
    (item) => item.name !== ctx.match
  );
});
bot.command("show_trackers", (ctx) => {
  ctx.reply("Here are all your current trackers", {
    reply_markup: trackersMenu,
  });
});

function isFuturePrompt(prompt: Prompt): boolean {
  const now = Date.now();
  return prompt.time.getTime() > now;
}

bot.command("show_future_prompts", (ctx) => {
  let futureprompts = ctx.session.prompts.find(isFuturePrompt);
  ctx.reply(JSON.stringify(futureprompts));
});
bot.on("message", (ctx) => {
  const message = ctx.message;
  ctx.reply("Got another message!" + message.text);
});

bot.catch((err) => console.error(err));
bot.start({
  onStart: (bot) => {
    console.log(`${bot.username} started!`);
  },
});

function findNextPrompt(
  prompts: Array<Prompt> | undefined
): Prompt | undefined {
  if (prompts != undefined) {
    return prompts.sort().find(isFuturePrompt);
  } else {
    return undefined;
  }
}

function calculateWait(prompt: Prompt | undefined): number | undefined {
  if (prompt != undefined) {
    return prompt.time.getTime() - Date.now();
  } else {
    return undefined;
  }
}

function waitThenRespond(ctx: MyContext) {
  let next_prompt = findNextPrompt(ctx?.session.prompts);
  let wait = calculateWait(next_prompt);
  if (typeof wait == "undefined") {
    ctx.session.experience_sampling_running = false;
    ctx.reply("Experience sampling ended due to error.");
  } else {
    console.log(
      `waiting ${wait / 1000} seconds until ${JSON.stringify(
        next_prompt?.time
      )} to prompt user id ${ctx.msg?.chat.id}`
    );
    setTimeout(() => {
      respond(ctx);
      waitThenRespond(ctx);
    }, wait + 100); // sometimes it is ~0.002 seconds too early, causing a double check-in. This is an easy way to fix it
  }
}

function respond(ctx: MyContext) {
  let chat_id: number | undefined = ctx?.msg?.chat.id;
  if (chat_id != undefined) {
    ctx.api.sendMessage(chat_id, "Time for a check-in!", {
      reply_markup: trackersMenu,
    });
  }
}
