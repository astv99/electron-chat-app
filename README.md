# Chat-App

**Description**: A real-time chat application implemented with Electron 34, using WebSockets and React 19.

## Requirements

Install Node.js

### Setup

1. Clone the repo: `git clone https://github.com/astv99/electron-chat-app.git`
2. Install dependencies: `npm install`
3. Start the Electron server: `npm run server`
4. Start the Electron client: `npm run start`
5. A packaged Windows EXE is also available for download here via Dropbox: https://www.dropbox.com/scl/fi/kzerjio4x13rovejp0vwp/chat-app-1.0.0-Setup.exe?rlkey=6a1j8lc84qs9irwtenkasb8lv&st=1qsndc9w&dl=0

#### Known limitations:
- Due to the additional server used by Electron Forge for Webpack and logging, it is not possible to spin up additional Electron instances without manually reconfiguring the port used by Webpack for a new instance. (This was not an issue in the standard version of Electron, which does not use Webpack.)
- Since Webpack uses port 3000 by default, the Electron server is assigned port 8081 to avoid conflicts.
- Limited scaling ability, since the server cannot differentiate between clients in its current form, and writes a JSON file to disk to save the chat messages instead of using a DBMS. (Additionally, having to manually reconfigure Webpack's port limits scaling ability as well.)

---

## Answers to Followup questions

1. **Please explain your process, concerns, and potential blockers if given a task to port the current PresenterHub electron application to macOS.**

	I would start my process porting PresenterHub to macOS by making sure to read the official docs first (there is plenty of info available that outlines the process to build for macOS), and likely using Electron Forge (through its available npm commands) to generate any needed binaries. While it sounds like some individuals have run into issues deploying on macOS in the past, some of these issues appear to be well-documented with workarounds at least, so there is certainly info available to be able to complete the task.

	1.1 **What challenges do you think you would encounter personally?**

	I think the main challenges for me would be a learning curve on Apple's proprietary software and processes (such as submission to their app store) that I have not previously used (i.e. macOS itself and Xcode, one of the listed prerequisites). Otherwise, I would not expect many other challenges that would slow me down to any significant effect.

	1.2 **Would you feel the need to fork the app?**

	No, I would not feel the need to fork the app since Electron is designed to be an all-inclusive tool that can deploy to all OS-es.

	1.3 **How comfortable are you with electron and macOS?**

	Now that I have some familiarity with Electron from doing the project, I would be very comfortable working with it, particularly towards building anything on the client-side as I have extensive experience using front-end technologies (Angular and Vue), and also on the server-side (with my previous experience in Node.js with Express.js to build REST APIs). However, I have not previously used macOS and would be at a disadvantage at first, but I do have strong familiarity with UNIX (which I know it uses under the hood) and can learn anything fairly quickly.
	
3. **Please provide an example via a github repository of a small application that you created on your own.  The application must meet the criteria listed below.**

	3.3 **A compiled release for Windows x86 (exe).**

	A generated Windows EXE is available inside the repo. No data is stored locally on the computer's host OS.

	3.4 **Needs to use Node, Next, React, or any language you saw that was used in the PresenterHub source code.**

	The app as built uses both Node.js and React 19.

	3.5 **Please include some stored data either in a small db or JSON file.**

	The app's server generates an internal /data/data.json file to store chat messages

	3.6 **Please provide a written explanation about your process and thinking and learning from the experience.**

	### My process

	**Step 1: Getting started w/ Electron and Electron Forge**

	As I was not previously familiar with Electron, I started with the official docs to refer to how to get started and created the sample tutorial application using the standard version of Electron. From reading the instructions for this exercise, I knew that I would need the ability to make a packaged EXE for Windows, which it appeared the tutorial application did not support by default, and further reading on the docs in the section "Packaging Your Application" indicated that I needed to install & use Electron Forge for that ability, which I went ahead and used, and verified that it could indeed generate a standalone EXE file.

	**Step 2: Building an initial version of the app**

	I decided to implement a basic chat app and knew that I would need to use either WebSockets or Socket.io to build it, and went with WebSockets for its simplicity. Referring to various docs and articles, I created a Node.js server inside the Electron app to act as the WebSockets server, and implemented an "initial version" of the full app (with the Node.js server and the Electron client) in the provided default files (index.html and renderer.js). Lastly, I also verified that I could launch a second Electron instance to communicate with the first, which worked seamlessly.

	**Step 3: Migrating to React**

	Since I now had a complete initial version of the application with the key chat functionality in place, the next goal was to migrate the "front-end" (the index.html and renderer.js files) to the latest version of React (19 as of this writing). Adding the latest version of React to Electron Forge is not very well-documented online, so it involved some trial & error to get everything installed & working together before even being able to migrate the front-end (one showstopping error being the Content Security Policy, which blocked access to the WebSockets server from the client). However once this was done, I was able to easily migrate the contents of renderer.js into React's useState and useEffect hooks.

	**Step 4: Adding a JSON data store**

	For the sake of simplicity, I added the ability for the WebSockets server to automatically save the chat message log to an internal JSON file (/data/data.json) every time that a chat message is sent from a client. Naturally, I would want to improve persistent data by adding a DBMS to support storing much more data, as well as the ability to have it accessible from the client (so that users would be able to download their messages if needed).

	**What I Learned**

	I learned several things from doing this project, which include some higher-level points as well as lower-level points:
	1. Prior to doing this project, I did not realize that it was incredibly easy to scaffold a starter Electron app with very little customization needed, and that it was just as easy as doing a straight npm install of the base package.
	2. I also realized that Electron abstracts away a lot of the underlying OS, to make it as easy as possible to use.
	3. I further learned that Electron Forge is a very convenient tool that allows much more ability and flexibility to generate binaries for operating systems, as well as the option to use React or Vue.
	4. I also learned that Electron has a lot of built-in safeguards, to prevent security risks from clients interacting with the Node.js server (e.g. the "nodeIntegration" property).
	5. I learned that despite being a very powerful tool, Electron is just a bit behind the curve with using Webpack (since React and Vue both use Vite now, and have deprecated Webpack for a while).
	6. Lastly, I learned that anything you can implement through traditional web development (both on the front-end and back-end) is feasible in Electron.