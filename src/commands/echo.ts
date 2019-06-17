import CommandClient from 'camdo'

export default function echo(client: CommandClient) {
	client.defineCommand({
	  id: "echo",
	  description: "Echo what you say!",
	  args: [{
	    id: "sentence",
	    description: "The sentence to echo",
	    capture: true,
	    required: true
	  }],
	  run([ sentence ]: [string]) {
	    return {
	      title: 'echo',
	      description: sentence,
	      color: 0x555555
	    }
	  }
	})
}