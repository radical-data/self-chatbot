import { random_times } from "./experience_sampling";
import { Prompt, SessionData, Tracker } from "./types";

const now = new Date();
const inTenSeconds = new Date(now.getTime() + 10 * 1000);
const inOneMinute = new Date(now.getTime() + 60 * 1000);
const inFiveMinutes = new Date(now.getTime() + 5 * 60 * 1000);

let prompts: Array<Date> = [now, inTenSeconds, inOneMinute, inFiveMinutes];

export function createInitialSessionData(): SessionData {
  return {
    // trackers: [],
    trackers: createDefaultTrackers(),
    prompts: random_times(new Date(), 4).map(function (a) {
      return { time: a };
    }),
    // prompts: prompts.map(function (a) {
    //   return { time: a };
    // }),
    readings: [],
    experience_sampling_running: false,
    current_tracker_menu: {
      name: "",
      possible_values: [],
      sample_type: "random",
    },
  };
}

export function createDefaultTrackers(): Array<Tracker> {
  return [
    {
      name: "Mood",
      possible_values: Array.from({ length: 11 }, (_, i) => i.toString()),
      sample_type: "random",
    },
    {
      name: "Sleep",
      possible_values: Array.from({ length: 11 }, (_, i) => i.toString()),
      sample_type: "open",
    },
  ];
}
