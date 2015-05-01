# API-Javascript-SDK
A Javascript SDK for accessing your Trackvia application data.

## Features

1. Simple client to access the Trackvia API

## Requires
jQuery 

https://jquery.com/

 
## API Access and The User Key

Obtain a user key by enabling the API at:

  https://go.trackvia.com/#/my-info

Note, the API is only available for Enterprise level accounts

## Usage

First instantiate a TrackVia API object

```javascript
var tv = new TrackVia(
    'YOUR_API_KEY',
    'YOUR_USER_EMAIL',
    'YOUR_PASSWORD',
    'TrackViaAPI');
```

Get a list of views and record
```javascript
  // Login
  tv.login().done(function() {
    // List the views
    tv.getViews().done( function(data) {
        // Get a single view  
        var viewId = data[0].id;
        tv.getView(viewId).done( function(response) {
            // fetch the record
            var recordId = response.data[0].id;
            tv.getRecord(viewId, recordId);
                           
        });
       
        // search the view for "fish" 
        tv.searchView(viewId, "fish", 0, 10);
                    
    });
```


Create record
```javascript

  var data = {
                'Customer' : 'Acme',
                'State' : 'CO',
                'License' : 'AEZ4321'
            };

  var tableId = 123;

  tv.login().done(function() {
     tv.createRecord(tableId, data);
  });
```

