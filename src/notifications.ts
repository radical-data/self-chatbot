import { MyContext } from "./types";
import { checkInMenu } from "./menus";

export function respond(ctx: MyContext) {
  let chat_id: number | undefined = ctx?.msg?.chat.id;
  if (chat_id != undefined) {
    ctx.api.sendMessage(chat_id, "Time for a check-in!", {
      reply_markup: checkInMenu,
    });
  }
}
