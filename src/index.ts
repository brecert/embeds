import CommandClient from 'camdo'
import * as camdo from 'camdo'

import * as commands from './commands'
import * as handlers from './handlers'

let client = new CommandClient

commands.echo(client)
commands.neko(client)
commands.help(client)

handlers.embeds(client)