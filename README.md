# App Engine TypeScript sample for api filtered (parte1) and csv convert(parte2) to json

parte1 :https://mimetic-plate-385622.ue.r.appspot.com/resumen/2019-12-09?dias=3
parte2 : https://mimetic-plate-385622.ue.r.appspot.com/

This sample provides an example of how to compile TypeScript files while
deploying to App Engine.

The `gcp-build` NPM script is used to trigger the TypeScript compilation
process. This step happens automatically when deploying to App Engine, but must
be performed manually when developing locally.

## Setup

Install dependencies:

   npm install

## Running locally

1. Perform the build step:

    npm run gcp-build

1. Run the completed program

    npm start

## Deploying to App Engine

Deploy your app:

    npm run deploy

By default, this application deploys to [App Engine Standard][appengine]. _(Recommended)_
Deploy to App Engine Flexible by [modifying `app.yaml`][app_yaml].

[appengine]: https://cloud.google.com/appengine/docs/standard/nodejs
[app_yaml]: https://cloud.google.com/appengine/docs/flexible/nodejs/configuring-your-app-with-app-yaml
[tutorial]: https://cloud.google.com/appengine/docs/standard/nodejs/quickstart
[contributing]: https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/main/CONTRIBUTING.md
