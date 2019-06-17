import http from 'http'
import restana from 'restana'
import CommandClient from 'camdo'
import * as camdo from 'camdo'

export function generateURL(id: string, args: camdo.ICamdoArgument[]) {
	return `/${id}/${
		args.map(arg => `:${
			arg.id
		}${
			!arg.required ? '?' : ''
		}`).join('/')
	}`
}

export default function(client: CommandClient) {
	const service = restana({
		server: http.createServer(),
		ignoreTrailingSlash: false
	})

	client.addHandler({
		id: 'embeds',
		event(resolve, cmd) {
			let url = generateURL(cmd.id, cmd.args)
			service.all(url, async (req, res) => {
				let args = Object.values(req.params)
				resolve(args, res)
			})
		},
		send(data, res: http.ServerResponse & restana.ResponseExtensions) {
			console.log(res)
			res.send(data)
		}
	})

	service.start(3000).then(()=> {
		console.log('running on port 3000')
	})
}
