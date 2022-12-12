import { Bot, Context, session, SessionFlavor } from "grammy";
import { BOT_TOKEN } from "./config";
import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";

interface SessionData {
  cats: Array<string>;
}

type MyContext = Context & ConversationFlavor & SessionFlavor<SessionData>;
type MyConversation = Conversation<MyContext>;

const bot = new Bot<MyContext>(BOT_TOKEN);

bot.use(session({ initial: () => ({ cats: ["marina"] }) }));
bot.use(conversations());

async function greeting(conversation: MyConversation, ctx: MyContext) {
  await ctx.reply(
    `Hi there! Your first cat is called ${ctx.session.cats[0]}. What is your second cat's name?`
  );
  const message = await conversation.form.text();
  // await ctx.session.cats.push(message);
  conversation.session.cats.push(message);
  ctx.reply(`Your cats are called ${JSON.stringify(ctx.session.cats)}.`);
}

bot.use(createConversation(greeting));

bot.command("start", async (ctx) => {
  await ctx.conversation.enter("greeting");
});

bot.command("show_data", (ctx) => {
  ctx.reply(JSON.stringify(ctx.session.cats));
});

bot.start();
