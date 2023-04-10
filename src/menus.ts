import { Menu } from "@grammyjs/menu";
import { MyContext } from "./types";
import { MenuRange } from "@grammyjs/menu";
import { downloadData } from "./control_data";

export const homeMenu = new Menu<MyContext>("homeMenu")
  .submenu("Lab 🧪", "labMenu")
  //   .row()
  .text("Check-in 📝", (ctx) => ctx.reply("Start check-in"))
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
  .text("New tracker ➕")
  .row()
  .back("Go Back");

export const trackerMenu = new Menu<MyContext>("trackerMenu")
  .text("Edit tracker")
  .row()
  .text("Archive tracker")
  .row()
  .text("Download tracker data");
// .row()
// .back("Go Back");

export const experimentsMenu = new Menu<MyContext>("experimentsMenu")
  .text("Edit experiment")
  .row()
  .text("Archive experiment")
  .row()
  .text("Download experiment data")
  .row()
  .back("Go Back");

export const checkInMenu = new Menu<MyContext>("checkInMenu");
checkInMenu
  .dynamic((ctx, range) => {
    for (const i of ctx.session.trackers[0].possible_values) {
      range
        .text(i.toString(), (ctx) => {
          ctx.reply(`You chose ${i} for ${ctx.session.trackers[0].name}.`);
          ctx.session.readings.push({
            time: new Date(),
            tracker_name: ctx.session.trackers[0].name,
            value: i,
          });
          setTimeout(() => ctx.reply("See you at the next check-in!"), 1500);
        })
        .row();
    }
  })
  .row()
  .back("Go Back");

export const resourcesMenu = new Menu<MyContext>("resourcesMenu")
  .text("Check out our resources", (ctx) =>
    ctx.reply("https://theselfapp.com/resources")
  )
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
  .submenu("Delete My Data ⚠️", "deleteDataMenu")
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
homeMenu.register(resourcesMenu);
homeMenu.register(profileMenu);
homeMenu.register(controlDataMenu, "profileMenu");
homeMenu.register(aboutMenu, "profileMenu");
