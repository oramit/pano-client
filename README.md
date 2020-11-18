### `How to run this server?`

In the project directory, you can run:

### `node src/index.js`

### `Some modules to talk about`
1. index.js is our program entry point.
2. data.js is the application input file.
3. app/app.js manages all the interactions with calculations server.

### `How to test this application?`

I used Jest for testing my application.
You can run from project directory:
### `npm run test`
Test suites:
1. server/utils.test.js ==> will test server utility with a mocked connector.
2. app/appUtils.test.js ==> to test application utils methods.
3. app/app.test.js ==> to test the scenario (including calculations server side).