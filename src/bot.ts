import { Bot, session, GrammyError, HttpError } from "grammy";
import { emojiParser } from "@grammyjs/emoji";
import { conversations, createConversation } from "@grammyjs/conversations";
import { BOT_TOKEN } from "./config";
import { Tracker, SessionData, MyContext, MyConversation } from "./types";
import { deleteData, downloadData } from "./control_data";
import {
  random_times,
  waitThenRespond,
  isFuturePrompt,
} from "./experience_sampling";
import {
  homeMenu,
  trackersMenu,
  labMenu,
  checkInMenu,
  resourcesMenu,
  profileMenu,
  aboutMenu,
} from "./menus";
import { add_tracker } from "./manage_trackers";
import { onboarding_conversation } from "./onboarding";
import { add_tracker_conversation } from "./conversations";
import { initial_data } from "./initial_data";

const bot = new Bot<MyContext>(BOT_TOKEN);

function initial(): SessionData {
  return initial_data;
}
bot.use(session({ initial }));
bot.use(emojiParser());
bot.use(conversations());
bot.use(homeMenu);
bot.api.setMyCommands([
  { command: "menu", description: "The main menu" },
  { command: "check_in", description: "Input data" },
  { command: "lab", description: "Edit trackers and experiments" },
  { command: "resources", description: "See resources" },
  { command: "profile", description: "Edit your profile" },
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
  { command: "show_trackers", description: "Show all trackers" },
  { command: "add_tracker", description: "Add a new thing to track" },
  { command: "remove_tracker", description: "Remove a single tracker" },
  { command: "about", description: "Show about text" },
  { command: "download_data", description: "Download all data" },
]);

bot.use(createConversation(onboarding_conversation));
bot.use(createConversation(add_tracker_conversation));

bot.command("start", async (ctx) => {
  await ctx.conversation.enter("onboarding_conversation");
});

bot.command("experience_sampling_status", (ctx) => {
  if (ctx.session.experience_sampling_running) {
    ctx.reply("Experience sampling is running!");
  } else if (!ctx.session.experience_sampling_running) {
    ctx.reply("Experience sampling is not running!");
  } else {
    ctx.reply("There is an error with experience sampling.");
  }
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

bot.command("download_data", (ctx) => downloadData(ctx));

bot.command("delete_data", (ctx) => deleteData(ctx));

bot.command("random_times", (ctx) =>
  ctx.reply(JSON.stringify(random_times(new Date(), 4)))
);

bot.command("menu", (ctx) => {
  ctx.reply("The main menu", {
    reply_markup: homeMenu,
  });
});

bot.command("lab", (ctx) => {
  ctx.reply("The lab menu", {
    reply_markup: labMenu,
  });
});

bot.command("check_in", (ctx) => {
  ctx.reply("The check-in menu", {
    reply_markup: checkInMenu,
  });
});

bot.command("resources", (ctx) => {
  ctx.reply("The resources menu", {
    reply_markup: resourcesMenu,
  });
});

bot.command("profile", (ctx) => {
  ctx.reply("The profile menu", {
    reply_markup: profileMenu,
  });
});

bot.command("about", (ctx) => {
  ctx.reply(
    "Self Bot is a chatbot built by Radical Data and supported by MediaFutures.",
    {
      reply_markup: aboutMenu,
    }
  );
});

bot.command("add_tracker", async (ctx) => {
  await ctx.conversation.enter("add_tracker_conversation");
});
bot.command("remove_tracker", (ctx) => {
  ctx.session.trackers = ctx.session.trackers.filter(
    (item) => item.name !== ctx.match
  );
});
bot.command("show_trackers", (ctx) => {
  ctx.reply("Here are all your current trackers:", {
    reply_markup: trackersMenu,
  });
});

bot.command("show_future_prompts", (ctx) => {
  let futureprompts = ctx.session.prompts.find(isFuturePrompt);
  ctx.reply(JSON.stringify(futureprompts));
});

bot.on("message", (ctx) => {
  const message = ctx.message;
  ctx.reply("Got another message! " + message.text);
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});
bot.start({
  onStart: (bot) => {
    console.log(`${bot.username} started!`);
  },
});
