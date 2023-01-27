(() => {
  // Listen for when we navigate, and then begin the process of adding the button
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.message === "url changed") {
      // The interval will check every 100ms to see if the div exists
      // Once it does, we'll kill the interval and add the button
      const interval = setInterval(() => {
        const div = document.querySelector(
          ".public-DraftEditorPlaceholder-inner"
        );
        if (div) {
          // if the div exists, and we haven't added the button yet, then add the button
          // otherwise just kill the interval and do nothing
          if (document.querySelector("#generateButton")) {
            clearInterval(interval);
            return;
          }
          // Add the button. It should just be a clickable "🤔" next to the send button.
          // Feel free to change the styling to your liking!
          const button = document.createElement("button");
          button.id = "generateButton";
          button.style.border = "none";
          button.style.background = "none";
          button.style.cursor = "pointer";
          button.style.paddingRight = "3px";
          button.onmousedown = () => {
            button.style.transform = "scale(0.8)";
          };
          button.onmouseup = () => {
            button.style.transform = "scale(1)";
          };
          button.style.fontSize = "1.2em";
          button.onmouseover = () => {
            button.style.opacity = "0.7";
          };
          button.onmouseout = () => {
            button.style.opacity = "1";
          };
          button.style.transitionDuration = "0.2s";
          button.innerText = "🤔";
          const sendButton = document.querySelector(
            "[data-testid='dmComposerSendButton']"
          );
          sendButton.parentNode.insertBefore(button, sendButton);

          // Get the current container of messages
          const dmActivityContainer = document.querySelector(
            "[data-testid='DmActivityContainer']"
          );
          // Grab all the messages in the container, and convert them to a labelled array
          const messages = Array.from(
            dmActivityContainer.querySelectorAll("[data-testid='tweetText']")
          ).map((div) => {
            // r-gu4em3 is an identifiable class for messages sent by the other person
            if (div.parentElement.classList.contains("r-gu4em3")) {
              return {
                sender: "them",
                text: div.lastElementChild.innerText,
              };
            } else {
              return {
                sender: "me",
                text: div.lastElementChild.innerText,
              };
            }
          });
          const lastMessages = messages.slice(-4);

          // TODO: clean up code here, it's messy, and has repeated code.
          // TODO: also, rm old code when you're done with it
          button.addEventListener("click", () => {
            // Start the process of generating a response. Set to "thinking" emoji as a visual loading indicator
            // We then send the last 4 messages to the background script, which will then send a request to the API
            button.innerText = "💭";
            chrome.runtime.sendMessage(
              { data: lastMessages },
              function (response) {
                if (
                  response != undefined &&
                  response != "" &&
                  response != "No API key"
                ) {
                  // Trim() will get rid of any weird whitespace at beginning or end of response, openai will sometimes add this!
                  response = response.trim();

                  const inputData = document.querySelector(
                    ".DraftEditor-editorContainer"
                  ).lastElementChild?.lastElementChild?.lastElementChild
                    .lastElementChild?.lastElementChild?.innerHTML;
                  // We'll also check if the placeholder text exists, if it does, we click smthg else
                  const placeholder = document.querySelector(
                    ".public-DraftEditorPlaceholder-inner"
                  );
                  if (
                    inputData == '<br data-text="true">' ||
                    placeholder != null
                  ) {
                    const rootDiv = document.querySelector(
                      ".public-DraftEditorPlaceholder-inner"
                    );
                    // Simulate a click event on the element
                    var event = new MouseEvent("click", {
                      bubbles: true,
                      cancelable: true,
                      view: window,
                    });
                    rootDiv.dispatchEvent(event);
                    const textinput = document.querySelector(
                      ".DraftEditor-editorContainer"
                    );

                    document.execCommand("insertText", false, response);

                    // // After click, remove placeholder div
                    // const placeholder = document.querySelector(
                    //   ".public-DraftEditorPlaceholder-inner"
                    // );
                    // placeholder.remove();

                    // // Now we can add the response text to the text input
                    // const textinput = document.querySelector(
                    //   ".DraftEditor-editorContainer"
                    // );
                    // const replace = `<div aria-describedby="placeholder-987cj" aria-multiline="true" class="notranslate public-DraftEditor-content" contenteditable="true" data-testid="dmComposerTextInput" role="textbox" spellcheck="false" tabindex="0" no-focustrapview-refocus="true" style="outline: none; user-select: text; white-space: pre-wrap; overflow-wrap: break-word;"><div data-contents="true"><div class="" data-block="true" data-editor="987cj" data-offset-key="557b0-0-0"><div data-offset-key="557b0-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span data-offset-key="557b0-0-0"><span data-text="true">${response}</span></span></div></div></div></div>`;
                    // textinput.innerHTML = replace;
                    // BAM. Set the button back to the thinking emoji
                    button.innerText = "🤔";
                  } else {
                    // if we've already typed something, we want to replace it
                    // this means we click the input rather then the placeholder
                    const rootDiv = document.querySelector(
                      ".DraftEditor-editorContainer"
                    );
                    // Simulate a click event on the element
                    var event = new MouseEvent("click", {
                      bubbles: true,
                      cancelable: true,
                      view: window,
                    });
                    rootDiv.dispatchEvent(event);

                    // delete the current, and insert the new text
                    document.execCommand("selectAll", false, null);
                    document.execCommand("delete", false, null);
                    document.execCommand("insertText", false, response);

                    // const textinput = document.querySelector(
                    //   ".DraftEditor-editorContainer"
                    // );
                    // const replace = `<div aria-describedby="placeholder-987cj" aria-multiline="true" class="notranslate public-DraftEditor-content" contenteditable="true" data-testid="dmComposerTextInput" role="textbox" spellcheck="false" tabindex="0" no-focustrapview-refocus="true" style="outline: none; user-select: text; white-space: pre-wrap; overflow-wrap: break-word;"><div data-contents="true"><div class="" data-block="true" data-editor="987cj" data-offset-key="557b0-0-0"><div data-offset-key="557b0-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span data-offset-key="557b0-0-0"><span data-text="true">${response}</span></span></div></div></div></div>`;
                    // textinput.innerHTML = replace;
                    button.innerText = "🤔";
                  }
                } else {
                  alert(
                    "No response from OpenAI. Ensure you have a key in `background.js`! Feel free to msg @aleemrehmtulla on Twitter for any help :)"
                  );
                }
              }
            );
          });
          clearInterval(interval);
        }
      }, 1000);
    }
  });
})();
