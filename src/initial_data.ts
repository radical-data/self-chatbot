import { random_times } from "./experience_sampling";
import { SessionData, Tracker } from "./types";

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
