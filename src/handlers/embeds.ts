import http from 'http'
import restana from 'restana'
import CommandClient from 'camdo'
import * as camdo from 'camdo'

import flatCache from 'flat-cache'
let query = require("connect-query")

const responseCache = flatCache.load('responseCache', '.cache')

export function generateURL(id: string, args: camdo.ICamdoArgument[]) {
	return `/${id}/${
		args.map(arg => `:${
			arg.id
		}${
			!arg.required ? '?' : ''
		}`).join('/')
	}`
}

import { html } from 'common-tags'
import { escape } from 'validator'

export function camdoNameToPropertyName(name: string, v: string | number) {
	let escaped = escape(`${v}`)

	switch (name) {
		case "name": return ["og:site_name", escaped]
		case "title": return ["og:title", escaped]
		case "description": return ["og:description", escaped]
		case "image": return ["og:image", escaped]

		case "color": return ["theme-color", `#${(v as number).toString(16)}`]

		case "format": {
			if(v === "large_image" || v === "default") {
				return ["twitter:card", "summary_large_image"]
			} else {
				throw new Error(`invalid image format '${escaped}'`)
			}
		}

		default: throw new Error(`invalid name '${name}' while converting to property names`)
	}
}

export function generateHTML(data: camdo.ICamdoFormat) {
	let escaped = Object.entries(data).map(([k, v]) => camdoNameToPropertyName(k, v))

	function getColor() {
  	let obj = Object.fromEntries(escaped)
  	return 'theme-color' in obj ? obj['theme-color'] : 'rgb(100,100,100,0.2)'
	}

	return html`
		<html lang="en-us">
			<head>
				<meta charset="utf-8">
				<title>embeds</title>
				${escaped.map(([k, v]) => `<meta property="${k}" content="${v}">`)}
				<meta name="viewport" content="width=device-width, initial-scale=1">
				<link rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/base-min.css">
				<style>
					:root {
					  --border-radius: 10px;
					  --padding: 10px;
					  
					  --color-bar-width: 10px;
					  --color-bar-color: ${getColor()};
					  
					  --embed-background: rgb(200,200,200,0.1);
					  --embed-border-width: 2px;
					  --embed-border-color: ${getColor()};
					  --embed-margin: 2px;
					}

					body {
					  height: 90vh;
					  display: flex;
					  align-content: center;
					  align-items: center;
					}

					.embed-container {
					  height: auto;
					  margin: auto;
					  
					  overflow: hidden;
					  border-radius: var(--border-radius);
					  
					  display: flex;
					}

					.color {
					  width: var(--color-bar-width);
					  background: var(--color-bar-color);
					}

					.embed {
					  background: var(--embed-background);
					  
					  padding: var(--padding);
					  padding-top: calc(var(--padding) / 2);
					  
					  border: var(--embed-border-width) solid var(--embed-border-color);
					  border-left: 0px;
					  border-radius: 0 var(--border-radius) var(--border-radius) 0;
					  
					  display: flex;
					  flex-direction: column;
					
					  max-width: calc(80vmin - var(--color-bar-width));

					  white-space: pre;
					}

					.embed > div {
					  margin: var(--embed-margin);
					}

					.name {
					  font-size: 0.9em;
					  opacity: 0.8;
					}

					.image {
					  border-radius: var(--border-radius)
					}

					.name ~ .large-image,
					.title ~ .large-image,
					.description ~ .large-image {
					  margin-top: 4px;
					}

					.large_image {
					  margin: auto;
					  max-height: 300px;
					  max-width: calc(90vmin - var(--color-bar-width));
					}
				</style>
			</head>
			<body>
				<div class="embed-container">
					<div class="color"></div>
					<div class="embed">
						${escaped.map(([k, v], i) => {
							let name = Object.keys(data)[i]
							switch (name) {
								case "color": return ``
								case "format": return ``
								case "image": return `<img class="${name} ${data.format}" src="${v}">`
								default: return `<div class="${name}">${v}</div>`
							}
						})}
					</div>
				</div>
			</body>
		</html>
	`
}

export default function(client: CommandClient) {
	const service = restana({
		server: http.createServer()
	})

	service.use(query())

	client.addHandler({
		id: 'embeds',
		event(resolve, cmd) {
			let url = generateURL(cmd.id, cmd.args)

			console.log(`adding path ${url}`)

			service.all(url, async (req, res) => {
				let args = Object.values(req.params)

				let data = responseCache.getKey(req.url!)

				if(data !== undefined) {
					res.send(generateHTML(data))
				} else {
					resolve(args, res, req)
				}
			})

		},
		send(data, res: http.ServerResponse & restana.ResponseExtensions, req: http.IncomingMessage & restana.RequestExtensions) {
			let key = responseCache.getKey(req.url!)
			
			// if the url hasn't be set yet and the url has a query and should be cached then cache the result
			if(key === undefined && Object.keys((req as any).query).length !== 0) {
				responseCache.setKey(req.url!, data)
			}

			res.send(generateHTML(data))
		}
	})

	service.start(3000).then(()=> {
		console.log('running on port 3000')
	})
}

function exitHandler(cb: (...any: any[]) => any) {
	cb()
	process.exit()
}

process.on('exit', () => exitHandler(() => responseCache.save()))
process.on('SIGINT', () => exitHandler(() => responseCache.save()))