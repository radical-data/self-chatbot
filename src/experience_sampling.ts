import { Prompt } from "./types";
import { respond } from "./notifications";
import { MyContext } from "./types";

export function random_times(day: Date, number_of_times: number): Array<Date> {
  let dates: Array<Date> = [];
  let day_ = new Date(day);
  let earliest_time = new Date(day_);
  earliest_time.setHours(9, 0, 0, 0);
  let latest_time = new Date(day_);
  latest_time.setHours(22, 0, 0, 0);
  for (let i = 0; i < number_of_times; i++) {
    let date_to_add = random_time(day_, earliest_time, latest_time);
    dates.push(date_to_add);
  }
  return dates.sort();
}

export function random_time(
  day: Date,
  earliest_time: Date,
  latest_time: Date
): Date {
  let time =
    earliest_time.getTime() +
    Math.random() * (latest_time.getTime() - earliest_time.getTime());
  let random_time = new Date(time);
  return random_time;
}

export function isFuturePrompt(prompt: Prompt): boolean {
  const currentTime = new Date();
  return prompt.time > currentTime;
}

export function findNextPrompt(
  prompts: Array<Prompt> | undefined
): Prompt | undefined {
  if (prompts != undefined) {
    return prompts.sort().find(isFuturePrompt);
  } else {
    return undefined;
  }
}

export function calculateWait(prompt: Prompt | undefined): number | undefined {
  if (prompt != undefined) {
    return prompt.time.getTime() - Date.now();
  } else {
    return undefined;
  }
}

function formatDate(date: Date | undefined): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };
  return new Intl.DateTimeFormat("en-UK", options).format(date);
}

export function waitThenRespond(ctx: MyContext) {
  let next_prompt = findNextPrompt(ctx?.session.prompts);
  if (next_prompt == undefined) {
    let today = new Date();
    let next_9_am = new Date();
    next_9_am.setHours(today.getHours() < 9 ? 9 : 33, 0, 0, 0);
    random_times(next_9_am, 4).map(function (a) {
      ctx.session.prompts.push({ time: a });
    });
    next_prompt = findNextPrompt(ctx?.session.prompts);
  }
  let wait = calculateWait(next_prompt);
  if (wait == undefined) {
    ctx.session.profile_settings.experience_sampling_running = false;
    ctx.reply("Experience sampling ended due to error.");
  } else {
    console.log(
      `waiting ${wait / 1000} seconds until ${formatDate(
        next_prompt?.time
      )} to prompt user id ${ctx.msg?.chat.id}`
    );
    setTimeout(() => {
      respond(ctx);
      waitThenRespond(ctx);
    }, wait + 100); // sometimes it is ~0.002 seconds too early, causing a double check-in. This is an easy way to fix it
  }
}

// function withinRange(candidateTime: Date, array: Array<Date>, range: ) {
//     for (let i = 0; i < array.length; i++) {
//       if (Math.abs(array[i] - candidateTime) <= 1) {
//         return true;
//       }
//     }
//     return false;
//   }
