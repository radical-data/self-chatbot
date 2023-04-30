import { MyContext } from "./types";
import { InputFile } from "grammy";
import { writeFile, unlink } from "fs";
import { createInitialSessionData } from "./initial_data";
import { formatDate, pause } from "./helpers";

function deleteFile(path: string): void {
  unlink(path, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err}`);
    } else {
      console.log(`File ${path} deleted successfully`);
    }
  });
}

export async function downloadData(ctx: MyContext): Promise<void> {
  let data = JSON.stringify(ctx.session);
  let directory_name = "./exports/";
  let file_name = `self-export-${ctx.chat?.id}-${formatDate()}.json`;
  let path = directory_name + file_name;
  writeFile(path, data, (err) => {
    if (err) throw err;
    console.log(`The file ${file_name} has been saved.`);
  });
  ctx.reply("Here's your data! " + ctx.emoji`${"wrapped_gift"}`);
  ctx.replyWithDocument(new InputFile(path));
  await pause();
  deleteFile(path); // clean up
}

export async function deleteData(ctx: MyContext): Promise<void> {
  ctx.session = createInitialSessionData();
  ctx.reply(
    "We've deleted all your data! " +
      ctx.emoji`${"bomb"}` +
      ctx.emoji`${"collision"}`
  );
}
