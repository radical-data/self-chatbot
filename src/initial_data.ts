import { random_times } from "./experience_sampling";

export const initial_data = {
  // trackers: [],
  trackers: [{ name: "test", possible_values: ["eggs", "fart"] }],
  prompts: random_times(new Date(), 4).map(function (a) {
    return { time: a };
  }),
  // prompts: prompts.map(function (a) {
  //   return { time: a };
  // }),
  readings: [],
  experience_sampling_running: false,
  current_tracker_menu: { name: "", possible_values: [] },
};
