import CommandClient from 'camdo'
import * as camdo from 'camdo'

import * as commands from './commands'
import * as handlers from './handlers'

let client = new CommandClient

async function defineCommands() {
	commands.echo(client)
	commands.neko(client)
	commands.help(client)

	await commands.translate(client).catch(err => { throw new Error(`Error while defining the 'translate' command: \n    ${err}`) })
	await commands.define(client).catch(err => { throw new Error(`Error while defining the 'define' command: \n    ${err}`) })
	
	commands.get(client)
}

defineCommands()
	.catch(console.error)
	.then(() => handlers.embeds(client))