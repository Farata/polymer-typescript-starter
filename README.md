# Polymer TypeScript Starter

## Getting Started With The Project

To launch the application you need to install the dependencies first with `npm install`.

All the commands that developers will directly run are exposed as npm scripts. There are five of them:

1. `npm start` - starts the development Web server that watches for the changes in the project. As soon as a change is made, it performs the required build steps (e.g. the TypeScript compilation) and then refreshes all currently opened pages in the browsers with the application.

2. `npm run lint` - runs `polylint` one the project's code. In the future versions it'll also run `tslint`.

3. `npm run test` - runs `web-component-tester` for the project.

4. `npm run build` - prepares the production version of the application. It creates a new directory `dist` and puts there all files that need to be deployed. Usually you want to run it on your continuous integration server.

5. `npm run serve:dist` - this command internally executes `npm run build` and then additionally launches a static Web server (it supports sending gzipped files as well) in the `dist` directory. Use this command when you are done with implementing a feature but before pushing the changes to the central repository. It gives you a chance to take a look at your application in the environment close to production.
