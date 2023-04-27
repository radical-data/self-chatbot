import { Menu } from "@grammyjs/menu";
import { MyContext } from "./types";
import { deleteData, downloadData } from "./control_data";

export const homeMenu = new Menu<MyContext>("homeMenu")
  .submenu("Lab 🧪", "labMenu")
  //   .row()
  .submenu("Check-in 📝", "checkInMenu")
  .row()
  .submenu("Resources 📚", "resourcesMenu")
  //   .row()
  .submenu("Profile ⚙️", "profileMenu");

export const labMenu = new Menu<MyContext>("labMenu")
  .submenu("Trackers 🌡️", "trackersMenu")
  .row()
  .submenu("Experiments 💥", "experimentsMenu")
  .row()
  .back("Go Back");

export const trackersMenu = new Menu<MyContext>("trackersMenu");
trackersMenu
  .dynamic((ctx, range) => {
    for (const tracker of ctx.session.trackers) {
      range
        .text(tracker.name.toString(), (ctx) => {
          ctx.reply(`Let's look at ${tracker.name.toString()}`, {
            reply_markup: trackerMenu,
          });
        })
        .row();
    }
  })
  .row()
  .text("New tracker ➕", (ctx) =>
    ctx.conversation.enter("add_tracker_conversation")
  )
  .row()
  .back("Go Back");

export const trackerMenu = new Menu<MyContext>("trackerMenu")
  .text("Edit tracker")
  .row()
  .text("Archive tracker")
  .row()
  .back("Go Back");

export const experimentsMenu = new Menu<MyContext>("experimentsMenu")
  .text("Edit experiment")
  .row()
  .text("Archive experiment")
  .row()
  .back("Go Back");

export const checkInMenu = new Menu<MyContext>("checkInMenu");
checkInMenu
  .dynamic((ctx, range) => {
    for (const tracker of ctx.session.trackers) {
      range
        .text(tracker.name.toString(), (ctx) => {
          ctx.session.current_tracker_menu = tracker;
          ctx.menu.nav("checkInMenuTracker");
        })
        .row();
    }
  })
  .row()
  .back("Done check-in", (ctx) => ctx.reply("See you at the next check-in!"));

export const checkInMenuTracker = new Menu<MyContext>("checkInMenuTracker");
checkInMenuTracker
  .dynamic((ctx, range) => {
    for (const value of ctx.session.current_tracker_menu.possible_values) {
      range
        .text(value.toString(), (ctx) => {
          ctx.reply(
            `You chose ${value} for ${ctx.session.current_tracker_menu.name}.`
          );
          ctx.session.readings.push({
            time: new Date(),
            tracker_name: ctx.session.trackers[0].name,
            value: value,
          });
        })
        .row();
    }
  })
  .row()
  .back("Go Back");

export const resourcesMenu = new Menu<MyContext>("resourcesMenu")
  .url("Check out our resources", "https://theselfapp.com/resources")
  .row()
  .back("Go Back");

export const profileMenu = new Menu<MyContext>("profileMenu")
  .submenu("Control My Data 🗄️", "controlDataMenu")
  .row()
  .submenu("About ℹ️", "aboutMenu")
  .back("Go Back");

export const controlDataMenu = new Menu<MyContext>("controlDataMenu")
  .text("Download My Data ⬇️", (ctx) => downloadData(ctx))
  .row()
  .text("Delete My Data ⚠️", (ctx) => deleteData(ctx))
  .row()
  .back("Go Back");

export const aboutMenu = new Menu<MyContext>("aboutMenu")
  .text("Show Credits", (ctx) =>
    ctx.reply("Self is built by Radical Data and supported by MediaFutures.")
  )
  .row()
  .url("Visit the Self website", "https://theselfapp.com")
  .row()
  .url(
    "Check out the code",
    "https://github.com/radicaldataproject/self-chatbot"
  )
  .row()
  .url("Visit the Radical Data website", "https://radicaldata.org")
  .row()
  .back("Go Back");

homeMenu.register(labMenu);
homeMenu.register(trackersMenu, "labMenu");
homeMenu.register(trackerMenu, "trackersMenu");
homeMenu.register(experimentsMenu, "labMenu");
homeMenu.register(checkInMenu);
homeMenu.register(checkInMenuTracker, "checkInMenu");
homeMenu.register(resourcesMenu);
homeMenu.register(profileMenu);
homeMenu.register(controlDataMenu, "profileMenu");
homeMenu.register(aboutMenu, "profileMenu");
