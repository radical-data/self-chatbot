import { MyContext } from "./types";
import { InputFile } from "grammy";
import { writeFile } from "fs";
import { initial_data } from "./initial_data";

function formatDate(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // months are zero-indexed
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function downloadData(ctx: MyContext): void {
  let data = JSON.stringify(ctx.session);
  let directory_name = "./exports/";
  let file_name = "self-export-" + formatDate() + ".json";
  let path = directory_name + file_name;
  writeFile(path, data, (err) => {
    if (err) throw err;
    console.log(`The file ${file_name} has been saved.`);
  });
  ctx.reply("Here's your data! " + ctx.emoji`${"wrapped_gift"}`);
  ctx.replyWithDocument(new InputFile(path));
}

export function deleteData(ctx: MyContext): void {
  ctx.session = initial_data;
}
