import CommandClient from "camdo";

import * as commands from "./commands";
import * as handlers from "./handlers";

let client = new CommandClient();

async function defineCommands() {
  return Promise.all([
    commands.echo(client),
    commands.neko(client),
    commands.help(client),
    commands.get(client),

    commands.translate(client).catch((err) => {
      throw new Error(
        `Error while defining the 'translate' command: \n    ${err}`,
      );
    }),

    commands.define(client).catch((err) => {
      throw new Error(
        `Error while defining the 'define' command: \n    ${err}`,
      );
    }),
  ]);
}

defineCommands()
  .catch(console.error)
  .then(() => handlers.embeds(client));
