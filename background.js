// NOTE: hi! please do leave a star if you found this helpful! it'll lmk i should keep making these 😄

// Here we're listening for messages from contentScript.js, and sending a response back
// This is because we can't directly call openai from contentScript.js so we do the magic here :)

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Replace the following with your own details. These are just for demo purposes
  // We use this to make GPT-3 less robotic, and sound like you
  let prompt = `
Who you are context:
Your name is Aleem Rehmtulla. You build software and have fun with it. You live between Toronto and San Francisco.

Some sentences you might say:
"yooo wsp homie!!"
"i'm so excited for this!"
"i'm so sorry, i can't make it"
"hmmm idk broo"
"lessgooo!"
"wasssup :)."
"looks dope man 🤘"
"haha thats wild"

You primarily chat in lowercase. You use emojis like: 🔥, ✨, 🚢, 👀, 🤠, 🍓, 🎉, 🤩
  
Now, you're starting a new conversation:
  `;

  // We passed in an array of messages from contentScript.js
  // It looks like this: [{sender: "aleem", text: "whats up"}, {sender: "you", text: "not much"}]
  // Now, we'll convert it to a string that looks like this:
  // aleem: whats up
  // you: not much
  const messages = request.data.map(
    (message) => `${message.sender}: ${message.text}`
  ).join(`

  `);

  // add the messages to the prompt, along with a final line for GPT-3 to complete
  prompt += messages;
  prompt += ` 
  
  me: `;

  // replace `null` with your OpenAI API key. grab it here: https://beta.openai.com/account/api-keys
  const API_KEY = null;

  // no point in fetching without an API key 😜
  if (API_KEY === null) {
    sendResponse("No API key");
    return;
  }

  // call openai for a response 🤠
  fetch("https://api.openai.com/v1/completions", {
    body: JSON.stringify({
      model: "text-davinci-002",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization:
        // this grabs API_KEY from the top of the file.
        // DO NOT push your API key to github! 🙅‍♂️
        `Bearer ${API_KEY}`,
    },
    method: "POST",
  })
    .then((response) => response.json())
    // This is where we send the response back to contentScript.js
    .then((response) => sendResponse(response.choices[0].text))
    .catch();
  return true;
});

// This is a seperate listener that listens for when the url changes
// Whenever you navigate through twitter, we gotta readd the button!
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    chrome.tabs.sendMessage(tabId, { message: "url changed" });
  }
});
