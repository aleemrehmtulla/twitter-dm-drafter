# gpt3-twitter-extension 🤔

## What is this?

gpt3-twitter-extension is an add-on to twitter. it'll show up right next to the send button in your DMs.

when you click the button, it will give you a draft response based on the conversation.

you can regenerate as many times as you want, i store nothing! all your keys 🤘

## Demo!

mp4 link here

## Usage 🤝

1. clone this repo
2. add you openai API key in `background.js`
3. edit the prompt for personality (optional)
4. head to `chrome://extensions`
5. hit `developer mode` in top right
6. add the root of this repo in `load unpacked extension`

## For development 🧑‍💻

pretty basic build, if you wanna dig around:

`background.js` -> calls api

`manifest.json` -> chrome extension config

`contentScript.js` -> whenever you navigate, place a button. on press, tell background to get response

### Notes

- If you use this, pls star it! Helps me know if I should build more stuff like this :)
- Code is not perfect! Have a couple things I wanna fix, just some trivial best practices heh

## Connect with me 🤗

https://twitter.com/aleemrehmtulla

https://aleemrehmtulla.com

https://www.linkedin.com/in/aleemrehmtulla/
