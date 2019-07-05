# embeds
> the embeds server source code

the embeds server is mostly a test for my other project [camdo](https://github.com/Brecert/camdo), a generic bot framework.

embeds attempts to use every use every feature from camdo as a living test for it.

commands are modular and are framework agnostic, any commands that are written should work on any of the adapters specified.

embeds currently only has one adapter, the embeds server.

the embeds server uses the [Open Graph Protocol](http://opengraphprotocol.org/), [Twitter Cards](https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/abouts-cards.html), and the [theme-color](https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android) meta tag to create embeds and cards for most services to use

it's not practical but it's fun to see what you can do.

most sites cache cards for periods of time and then will periodically update them.

this can lead to unintended behavior for commands that have differing results.

to partially mitigate this embeds caches all results with a query to them

`GET /neko/` will not cache but `GET /neko/?1` will

## Installing and Running

Requirements:
- Node 12.4+

```sh
git clone https://github.com/Brecert/embeds.git

cd embeds

# fill out the config files in the config folder

npm install # or yarn install, this project was made using primarily yarn!

npm run start # or yarn start
```

## Todo
- cleanup `oldGetAll` code to use fetch or similar
- document code
- add types for results
- add tests
- add a wikipedia article getter command
- add a command generator command
- add a google image command
- add a booru command
- add an urban dictionary command
- define feature sets for each of the commands (waiting for camdo to add this)
- add more handlers
- move to redis for caching eventually