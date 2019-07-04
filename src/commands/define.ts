import jsonfile from 'jsonfile'
import assert from 'assert'

import getAll, { oldGetAll } from '../util/getAll'
import CommandClient from 'camdo'
import * as camdo from 'camdo'


async function getKey() {
	return await jsonfile.readFile('./config/define.json')
}

export default async function define(client: CommandClient) {
	const apiKeys = await getKey()

	assert("dictionary_api_key" in apiKeys, `expected 'dictionary_api_key' in 'config/define.json'`)

	const apiKey: string = apiKeys.dictionary_api_key

	client.defineCommand({
		id: "define",
		description: "get the definition of a word",
		args: [{
			id: "word",
			description: "the word to get the definition of",
		}],
		async run([ word ]: [ string ]) {
	    const [res] = await oldGetAll(
	      [`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`],
	      { json: true }
	    )

	    let dict = res[0]

	    if(typeof dict === "string") {
	    	return {
	    		name: word,
	    		description: `Could not find ${word}, did you mean?\n${res.join(", ")}`
	    	}
	    }

	    let info = []
	    info.push(`${dict.fl || word}`)

	    if("prs" in dict.hwi) {
	    	info.push(`[${dict.hwi.prs[0].mw}]`)
	    } else if ("hw" in dict.hwi) {
	    	info.push(`[${dict.hwi.hw}]`)
	    }

	    info.push('\n')

	    if("lbs" in dict) {
	    	info.push(`${dict.lbs.join(', ')}`)
	    }

			let desc = dict.shortdef.length !== 0 
				? dict.shortdef.join('\n\n') 
				: dict.cxs.map((cx: any) => `${cx.cxl} ${cx.cxtis.map((is: any) => is.cxt).join(', ')}`).join(', ')

			return {
				name: info.join(' '),
				title: dict.hwi.hw,
				description: desc,
				color: 0x555555
			}		
		}
	})
}