import { InlineKeyboard, Keyboard } from "grammy";

export const trackerRangeKeyboard = new Keyboard()
  .text("0-10 (a good default)")
  .row()
  .text("True or false")
  .row()
  .text("Categories")
  .resized()
  .oneTime();

export const trackerSampleTypeKeyboard = new Keyboard()
  .text("Random sampling")
  .row()
  .text("Check-in")
  .resized()
  .oneTime();

export const confirmDeleteDataKeyboard = new InlineKeyboard()
  .text("No", "no")
  .text("Yes", "yes");
