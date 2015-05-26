# Drive API from JS

This is a sample project that shows how one can use the Google authentication, and also how to store
files in the user's Drive.

For a more detailed description, check out these 2 blog posts:

* [Using Google auth in Javascript](https://advancedweb.hu/2015/05/12/using-google-auth-in-javascript/)
* [Accessing Google Drive in Javascript](https://advancedweb.hu/2015/05/26/accessing-google-drive-in-javascript/)

## Live demo

For a live demo, see [this link](https://sashee.github.io/drive-api-from-js/)

## To run this sample project on your computer

Just clone the repo, host the files on a web server of your choice and open index.html in a browser.

_Note:_ The app must listen on port 8080, because that is the only whitelisted origin

## To change the API project

* Register a new project at the [Google Developers Console](https://console.developers.google.com/project)
* Create a new Client ID for a Web Application
  * Add a valid origin
  * Take note of the Client ID
* Enable Drive API
* At the gapi-auth-service there is a client id, change it to your project's