import CommandClient from 'camdo'
import * as camdo from 'camdo'
import * as Booru from 'booru'

export default function(client: CommandClient) {
	const sfw_list = Object.values(Booru.sites).filter(b => !b.nsfw).flatMap(b => b.aliases)

	client.defineType({
	  id: "booru",
	  display: sfw_list.join(", "),
	  validate: val => sfw_list.includes(val)
	})

	client.defineType({
	  id: "tag_List",
	  validate: val => val.split(',').length !== 0
	})

	client.defineCommand({
	  id: "get",
	  description: "get a random image from a booru",
	  args: [{
	    id: "tags",
	    name: "Tag list",
	    description: "The tags to search with",
	    type: "tag_list",
	    required: true
	  }, {
	  	id: "booru",
	  	name: "Booru",
	  	description: "The booru used to search",
	  	type: "booru",
	  	default_value: "safebooru",
	  	required: false
	  }],
	  async run([tags, booru]: [string, string]) {

	  	const [img] = await Booru.search(booru, tags, { limit: 1, random: true })

	    if(img === undefined) {
	    	return {
	    		title: "ERROR",
	    		description: `there was a problem getting the image with the tags "${tags}"`
	    	}
	    }

  		return {
  			name: `👍${img.score} ${
  				(img as any).down_score !== undefined ? `👎${(img as any).down_score}` : ""
  			} ${
  				(img as any).fav_count !== undefined ? `⭐${(img as any).fav_count}` : ""
  			}\n${
  				img.common.tags.join(', ').substring(0,200)
  			}`,
	      title: img.id,
  	    image: img.file_url,
      	color: 0x975dc4,
    	  format: "large_image" as "large_image"
    	}
	  }
	})
}