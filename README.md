# Firebase-CMS
A template Content Management System (CMS) built on Firebase Realtime Database complete with an admin dashboard. 

It is strongly recommended that the reader visit my detailed tutorial demonstrating how the code works and how to get started using this CMS prior to working with the code: [Part 1](https://engineeringeric.com/blog?p=host-a-cms-driven-website-for-free-part-1) and [Part 2](https://engineeringeric.com/blog?p=host-a-cms-driven-website-for-free-part-2)

Note that this example includes [jQuery](https://jquery.com/) and [Bootstrap](https://getbootstrap.com/) to simplify the JavaScript code and implement a responsive user interface. These dependencies are optional; the core CMS code works independent of these.

**Important:** Replace the Firebase app configuration code located in the [Firebase config JS file](/js/firebase-config.js) with your project's configuration code prior to use:

```javascript
// Initialize Firebase
var config = {
	apiKey: "YOUR_API_KEY",
	authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
	databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
	projectId: "YOUR_PROJECT_ID",
	storageBucket: "YOUR_PROJECT_ID.appspot.com",
	messagingSenderId: "YOUR_MESSAGING_SENDER_ID"
};


firebase.initializeApp(config);
```
