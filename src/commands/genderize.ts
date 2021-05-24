import getAll, { oldGetAll } from "../util/getAll";
import CommandClient from "camdo";
import * as camdo from "camdo";

interface IGenderizeResult {
  name: string;
  gender: "male" | "female" | null;
  probability: number;
  count: number;
}

export default function (client: CommandClient) {
  client.defineCommand({
    id: "genderize",
    description: "gender the estimated statistics of a gender for a given name",
    args: [{
      id: "name",
      name: "name",
      description: "The name you want to get the gender of",
      type: "any",
      // fail_message: `The 'neko' argument accepts ${client.types.get('neko')!.display}`,
      required: true,
    }],
    async run([name]: [string]) {
      const [stats]: IGenderizeResult[] = await oldGetAll(
        [
          `https://api.genderize.io/?name=${name}`,
        ],
        { json: true },
      );

      if (stats.gender === null) {
        return {
          title: stats.name,
          description:
            `No one is registered under the name '${name}' in our current samples`,
        };
      }

      return {
        title: stats.name,
        // description: `${stats.probability * 100}% of ${stats.gender}s have the name ${stats.name} in a sample count of ${stats.count}`
        description:
          `In a sample of ${stats.count} people named ${stats.name}, ${stats
            .probability * 100}% of them are ${stats.gender}`,
      };
    },
  });
}
