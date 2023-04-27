import { Context, SessionFlavor } from "grammy";
import { EmojiFlavor } from "@grammyjs/emoji";
import {
  type Conversation,
  type ConversationFlavor,
} from "@grammyjs/conversations";

type MyContext = EmojiFlavor<
  Context & SessionFlavor<SessionData> & ConversationFlavor
>;
type MyConversation = Conversation<MyContext>;

interface Reading {
  time: Date;
  tracker_name: string;
  value: string;
}

interface Tracker {
  name: string;
  possible_values: Array<string>;
  sample_type: "random" | "open";
}

interface Prompt {
  time: Date;
}

interface ProfileSettings {
  defaultPromptsPerDay: number;
  experience_sampling_running: boolean;
}

interface SessionData {
  readings: Array<Reading>;
  trackers: Array<Tracker>;
  prompts: Array<Prompt>;
  profile_settings: ProfileSettings;
  current_tracker_menu: Tracker;
}

export { Tracker, Prompt, SessionData, MyContext, MyConversation };
