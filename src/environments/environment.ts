// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDCWc5GYQHLPIl_eKDuqNVb-tAdmVDAVJU",
    authDomain: "kwikapp-77d77.firebaseapp.com",
    databaseURL: "https://kwikapp-77d77.firebaseio.com",
    projectId: "kwikapp-77d77",
    storageBucket: "kwikapp-77d77.appspot.com",
    messagingSenderId: "587167744825",
    appId: "1:587167744825:web:337af354888bcd1c"
  }
  
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
