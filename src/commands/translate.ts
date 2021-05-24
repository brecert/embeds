import jsonfile from "jsonfile";
import assert from "assert";

import getAll, { oldGetAll } from "../util/getAll";
import CommandClient from "camdo";
import * as camdo from "camdo";

async function getKey() {
  return await jsonfile.readFile("./config/translate.json");
}

async function getLanguages(key: string) {
  const [languages] = await oldGetAll(
    [`https://translate.yandex.net/api/v1.5/tr.json/getLangs?ui=en&key=${key}`],
    { json: true },
  );

  return languages;
}

export default async function translate(client: CommandClient) {
  const translationKeys = await getKey();

  assert(
    "yandex_translation_key" in translationKeys,
    `expected 'yandex_translation_key' in 'config/translate.json'`,
  );

  const yandexKey = translationKeys.yandex_translation_key;

  let languages = await getLanguages(yandexKey);

  client.defineType({
    id: "lang",
    display: Object.values(languages.dirs).map((k) => `${k}`).join(", "),
    validate: (val) => languages.dirs.includes(val),
  });

  client.defineCommand({
    id: "translate",
    description: "translate from one language to another",
    args: [{
      id: "text",
      name: "text",
      description: "the text to translate",
      type: "any",
      required: true,
    }, {
      id: "translation_direction",
      name: "translation direction",
      description: "the direction to translate. eg. English to Spanish",
      type: "lang",
      fail_message: `The 'translation_direction' argument accepts ${
        client.types.get("lang")!.display
      }`,
      required: true,
    }],
    async run([text, translationDirection]: [string, string]) {
      const [res] = await oldGetAll(
        [`https://translate.yandex.net/api/v1.5/tr.json/translate?text=${text}&lang=${translationDirection}&key=${yandexKey}`],
        { json: true },
      );

      if (res.code === 200) {
        return {
          name: res.lang,
          description: res.text.join(" "),
        };
      } else {
        return {
          name: `${res.code}`,
          description: res.message,
        };
      }
    },
  });
}
