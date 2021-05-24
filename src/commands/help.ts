import CommandClient from "camdo";
import * as camdo from "camdo";

function formatArg(arg: camdo.ICamdoArgument) {
  let [start, end] = arg.required ? ["<", ">"] : ["[", "]"];
  return `${start}${arg.id}${end}`;
}

export default function (client: CommandClient) {
  client.defineType({
    id: "command",
    display: Array.from(client.commands.keys(), ([v]) => {
      return v;
    }).join(", "),
    validate: (arg) => client.commands.has(arg),
  });

  client.defineCommand({
    id: "help",
    args: [
      {
        id: "command",
        name: "command",
        description: "Help for a specific command",
        type: "command",
        capture: true,
        required: false,
      },
    ],
    run([command]: [string | undefined]) {
      // console.log(Array.from(client.commands, ([key, value]) => `${key}: ${JSON.stringify(value)}`))
      if (!command) {
        let commandList = Array.from(client.commands, ([id, cmd]) => {
          return `${cmd.id} ${cmd.args.map(formatArg).join(" ")}`;
        })
          .map((cmd) => `> ${cmd}`)
          .join("\n");

        return {
          title: "commands",
          description: commandList,
        };
      } else {
        return {
          ...client.commands.get(command),
        };
      }
    },
  });
}
