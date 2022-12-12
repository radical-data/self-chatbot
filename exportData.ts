import { MyContext } from "./types";
import { InputFile } from "grammy";
import { writeFile } from "fs";

function exportData(ctx: MyContext): void {
  let data = JSON.stringify(ctx.session);
  let directory_name = "./exports/";
  let file_name = "export-" + ctx.chat?.id + ".json";
  let path = directory_name + file_name;
  writeFile(path, data, (err) => {
    if (err) throw err;
    console.log(`The file ${file_name} has been saved.`);
  });
  ctx.reply("Here's your data! " + ctx.emoji`${"wrapped_gift"}`);
  ctx.replyWithDocument(new InputFile(path));
}

export { exportData };
