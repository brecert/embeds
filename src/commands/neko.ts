import getAll, { oldGetAll } from "../util/getAll";
import CommandClient from "camdo";
import * as camdo from "camdo";

export default function (client: CommandClient) {
  const neko_list = [
    "pat",
    "hug",
    "smug",
    "slap",
    "poke",
    "neko",
    "woof",
    "meow",
    "kiss",
    "feed",
    "ngif",
    "waifu",
    "8ball",
    "tickle",
    "cuddle",
    "avatar",
    "fox_girl",
  ];

  client.defineType({
    id: "neko",
    display: neko_list.join(", "),
    validate: (val) => neko_list.includes(val),
  });

  client.defineCommand({
    id: "neko",
    description: "get a neko! :3",
    args: [{
      id: "neko_type",
      name: "Neko Type",
      description: "The type of neko you wish to display",
      type: "neko",
      default_value: "neko",
      fail_message: `The 'neko' argument accepts ${
        client.types.get("neko")!.display
      }`,
      required: false,
    }],
    async run([neko_type]: [string]) {
      let [cat, img] = await oldGetAll(
        [
          `https://nekos.life/api/v2/img/${neko_type}`,
          "https://nekos.life/api/v2/cat",
        ],
        { json: true },
      );

      return {
        title: cat.cat,
        image: img.url,
        color: 0x975dc4,
        format: "large_image" as "large_image",
      };
    },
  });
}
