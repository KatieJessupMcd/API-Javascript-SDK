# API-JavaScript-SDK

JavaScript Web SDK for working with application data in TrackVia. This SDK is meant to run in the browser and creates a global TrackviaAPI variable that can be referenced throughout your project.

## Getting Started

#### Include the file in your project:
Include the `build/trackvia-api.js` file in your project and put it in a script tag in your HTML file.

Write `<script src="./build/trackvia-api.js"></script>` in your HTML file.

#### Create an instance of the Trackvia API with your API Key:
`var api = new TrackviaAPI('YOUR KEY HERE');`

You can find your TrackVia API key by going to your My Account Page, then clicking the API Access page.

## Authenticating
You must authenticate before accessing any data in Trackvia. You can authenticate with an API User Access Token or with a username and password. We recommend using an Access Token.

#### Authenticating with Access Token
Pass your API User Auth Token into the constructor when you instantiate the API.<br>
`var api = new TrackviaAPI('YOUR KEY HERE', 'YOUR TOKEN HERE');`

#### Authenticating with Username and Password
Instantiate the API, then use the login method to authenticate.<br>
`var api = new TrackviaAPI('YOUR KEY HERE');` <br>
`api.login('YOUR USERNAME', 'YOUR PASSWORD');`

## Methods
All methods return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
These Promises will resolve to an object (JSON response from the request), except for files, which will return the response from the API request.

---


#### login(username, password)
_Authenticates as specified user._

Parameters:
* username : string
* password : string

---

#### getApps()
_Gets all apps available._

Parameters: _none_

---

#### getAppByName(name)
_Get an app by name._

Parameters:
* name : string

---

#### getUsers([paging])
_Get all users, optionally paged._

Parameters:
* [paging : object]
  * Properties:
    * start : number
      * Starting index for paging.
    * max : number
      * Page size.

---

#### addUser(userInfo)
_Add new user._

Parameters:
* userInfo: object
  * Properties:
    * email : string
    * firstName : string
    * lastName : string

---

#### getViews()
_Get all views._

Parameters: _none_

---

#### getViewByName(name)
_Get view by name._

Parameters:
* name : string

---

#### getView(id, [paging , query])
_Get view by id, optionally paged, and optionally filtered records._

Parameters:
* id : number
* [paging : object]
  * Properties:
    * start : number
      * Starting index for paging.
    * max : number
      * Page size.
* [query : string]
  * Filter record results in view

---

#### getRecord(viewId, recordId)
_Get record by id._

Parameters:
* viewId : number
* recordId : number

---

#### addRecord(viewId, recordData)
_Add new record._

Parameters:
* viewId: number
* recordData : object
  * Key value pair of field names and values for new record.

---

#### updateRecord(viewId, recordId, recordData)
_Update exisiting record._

Parameters:
* viewId : number
* recordId : number
* recordData : object
  * Key value pair of field names and values to update in record.

---

#### deleteAllRecordsInView(viewId)
_Delete all records in a view._

Parameters:
* viewId : number

---

#### deleteRecord(viewId, recordId)
_Delete record._

Parameters:
* viewId : number
* recordId : number

---

#### getFile(viewId, recordId, fieldName, [options])
_Get a file from a record._

Parameters:
* viewId : number
* recordId : number
* fieldName : string
* [options : object]
  * Properties:
    * width : number
      * Desired width of image file
    * maxDimension : number
      * Desired max dimension for image file
    * NOTE: _These options only apply when the file is an image. Options are mutually exlusive, but if both are defined, only the width will be used)._

Returns a Readable Stream in the response body

Example of How to Display Image Response in HTML: <br>
<pre>const response = await api.getFile()
const reader = await imageResponse.body.getReader();
let u8 = [];

await reader.read()
    .then(function processText({ done, value }) {
        if (done) { return; }
        
        u8 = [...u8, ...value];
        return reader.read().then(processText);
    });

const binary = '';
u8.forEach(byte => {
    binary += String.fromCharCode(byte);
});

const b64 = await btoa(binary);

const imageElement = document.getElementById('image');
imageElement.src = `data:image/png;base64,${b64}`;
</pre>

---

#### attachFile(viewId, recordId, fieldName, filePath)
_Attach a file to a record (or overwrite an existing file)._

Parameters:
* viewId : number
* recordId : number
* fieldName : string
* file : a file object from an HTML input (see example below)

Example: <br>
`var fileInput = document.getElementById('file-input');`<br>
`var file = fileInput.files[0];`<br>
`await api.attachFile(viewId, recordId, 'Field Name', file);`

---

#### deleteFile(viewId, recordId, fieldName)
_Delete file from record._

Parameters:
* viewId : number
* recordId : number
* fieldName : string

---

#### getAccessToken()
_Get access token for authentication._

---

#### getUserKey()
_Get user key for authentication._

## Additional Information
For additional information visit https://developer.trackvia.com/.
Note that the endpoints explained in the [docs](https://developer.trackvia.com/livedocs) are from the public api itself. This library is a wrapper around those endpoints to make development easier.

## Testing
Use the `test/testConfig.template.js` to create a `test/testConfig.js` file that contains your account information.

Open `test/test.html` to run tests in the browser.


