import { Tracker } from "./types";

export function add_tracker(
  allTrackers: Array<Tracker>,
  name: string,
  possible_values: Array<string>
) {
  let newTracker: Tracker = { name, possible_values };
  return [...allTrackers, newTracker];
}
