var TrackviaAPI =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Singleton service for handling authentication and API keys
 */

var Auth = function () {
    function Auth() {
        _classCallCheck(this, Auth);
    }

    _createClass(Auth, [{
        key: 'setUserKey',
        value: function setUserKey(userKey) {
            this.userKey = userKey;
        }
    }, {
        key: 'getUserKey',
        value: function getUserKey() {
            return this.userKey;
        }
    }, {
        key: 'setAccessToken',
        value: function setAccessToken(accessToken) {
            this.accessToken = accessToken;
        }
    }, {
        key: 'getAccessToken',
        value: function getAccessToken() {
            return this.accessToken;
        }
    }, {
        key: 'getRefreshToken',
        value: function getRefreshToken() {
            return this.refreshToken;
        }
    }, {
        key: 'setRefreshToken',
        value: function setRefreshToken(refreshToken, secondsUntilExpiration) {
            var _this = this;

            this.refreshToken = refreshToken;
            if (typeof secondsUntilExpiration !== 'number') {
                var _secondsUntilExpiration = parseInt(_secondsUntilExpiration);
            }

            if (this.refreshTimer) {
                clearTimeout(this.refreshTimer);
            }

            // Refresh token 15 seconds before it expires
            this.refreshTimer = setTimeout(function () {
                _this.doRefreshToken();
            }, (secondsUntilExpiration - 15) * 1000);
        }
    }, {
        key: 'doRefreshToken',
        value: async function doRefreshToken() {
            var params = {
                client_id: 'TrackViaAPI',
                grant_type: 'refresh_token',
                refresh_token: this.refreshToken
            };

            var refreshTokenResponse = fetch(__tv_host + '/oath/token', {
                method: 'POST',
                body: JSON.stringify(params)
            });

            var refreshTokenJSON = await refreshTokenResponse.json();

            if (refreshTokenJSON.access_token) {
                this.setAccessToken(refreshTokenJSON.access_token);
                this.setRefreshToken(refreshTokenJSON.refresh_token, refreshTokenJSON.expires_in);
            } else {
                throw new Error('Access token not returned from doRefreshToken()');
            }
        }
    }]);

    return Auth;
}();

module.exports = new Auth();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tvRequest = __webpack_require__(2);
var auth = __webpack_require__(0);

var TrackviaAPI = function () {
    /**
     * Creates new TrackviaAPI object
     * @param {String} apiKey
     * @param {String} accessToken (optional)
     * @param {String} host (optional)
     */
    function TrackviaAPI(userKey) {
        var accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var host = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'https://go.trackvia.com:443';

        _classCallCheck(this, TrackviaAPI);

        if (!userKey) {
            throw new Error('Must provide API key to TrackviaAPI constructor');
        }

        if (accessToken.length) {
            this.setAccessToken(accessToken);
        }

        window.__tv_host = host;

        auth.setUserKey(userKey);
    }

    /**
     * Authenticate into system as specified user.
     * Access and refresh tokens will be handled internally.
     * @param {String} username
     * @param {String} password
     * @return {Promise<Object>}
     */


    _createClass(TrackviaAPI, [{
        key: 'login',
        value: async function login(username, password) {
            var params = {
                qs: {
                    client_id: 'TrackViaAPI',
                    grant_type: 'password',
                    username: username,
                    password: password
                }
            };

            try {
                var loginResponse = await tvRequest.post('/oauth/token', params);
                if (loginResponse.access_token) {
                    auth.setAccessToken(loginResponse.access_token);
                    auth.setRefreshToken(loginResponse.refresh_token, loginResponse.expires_in);
                } else {
                    throw new Error('Access token not returned from login');
                }

                return loginResponse;
            } catch (err) {
                throw new Error('Login failed: ' + JSON.stringify(err));
            }
        }

        /**
         * Get all apps available
         * @return {Promise<Object>}
         */

    }, {
        key: 'getApps',
        value: function getApps() {
            return tvRequest.get('/openapi/apps');
        }

        /**
         * Get an app by name
         * @param {String} name
         * @return {Promise<Object>} 
         */

    }, {
        key: 'getAppByName',
        value: function getAppByName(name) {
            return tvRequest.get('/openapi/apps', { qs: { name: name } });
        }

        /**
         * Get all users, optionally paged
         * @return {Promise<Object>}
         */

    }, {
        key: 'getUsers',
        value: function getUsers() {
            var paging = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return tvRequest.get('/openapi/users', {
                qs: {
                    start: paging.start,
                    max: paging.max
                }
            });
        }

        /**
         * Add new user
         * @param {Object} userInfo with three string properties: email, firstName, and lastName
         * @returns {Promise<Object>}
         */

    }, {
        key: 'addUser',
        value: function addUser(userInfo) {
            if (!userInfo.email) {
                throw new Error('email must be supplied when adding user');
            }

            if (!userInfo.firstName) {
                throw new Error('firstName must be supplied when adding user');
            }

            if (!userInfo.lastName) {
                throw new Error('lastName must be supplied when adding user');
            }

            return tvRequest.post('/openapi/users', { qs: userInfo });
        }

        /**
         * Get all views
         * @return {Promise<Object>}
         */

    }, {
        key: 'getViews',
        value: function getViews() {
            return tvRequest.get('/openapi/views');
        }

        /**
         * Get view by name
         * @param {String} name of view
         * @return {Promise<Object/>}
         */

    }, {
        key: 'getViewByName',
        value: function getViewByName(name) {
            if (!name) {
                throw new Error('name must be supplied when getting view by name');
            }

            return tvRequest.get('/openapi/views', { qs: { name: name } });
        }

        /**
         * Get view by id, optional paging, and optional query to filter records
         * @param {Number} id 
         * @param {Object} paging object with properties start and max (numbers)
         * @param {String} query filter record results in view
         * @returns {Promise<Object>}
         */

    }, {
        key: 'getView',
        value: function getView(id) {
            var paging = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var query = arguments[2];

            if (query) {
                return tvRequest.get('/openapi/views/' + id + '/find', {
                    qs: {
                        q: query,
                        start: paging.start,
                        max: paging.max
                    }

                });
            } else {
                return tvRequest.get('/openapi/views/' + id, {
                    qs: {
                        start: paging.start,
                        max: paging.max
                    }
                });
            }
        }

        /**
         * Get record by id
         * @param {Number} viewId 
         * @param {Number} recordId
         * @returns {Promise<Object>}
         */

    }, {
        key: 'getRecord',
        value: function getRecord(viewId, recordId) {
            if (!viewId) {
                throw new Error('view id must be supplied to getRecord');
            }
            if (!recordId) {
                throw new Error('record id must be supplied to getRecord');
            }
            return tvRequest.get('/openapi/views/' + viewId + '/records/' + recordId);
        }

        /**
         * Add new record
         * @param {Number} viewId 
         * @param {Object} recordData key value pair of columns and values for the new record
         * @returns {Promise<Object>}
         */

    }, {
        key: 'addRecord',
        value: function addRecord(viewId, recordData) {
            if (!viewId) {
                throw new Error('viewId must be supplied to addRecord');
            }

            return tvRequest.post('/openapi/views/' + viewId + '/records', {
                body: {
                    data: [recordData]
                }
            });
        }

        /**
         * Update existing record
         * @param {Number} viewId 
         * @param {Number} recordId 
         * @param {Object} recordData key value pair of columns and values to update in the record
         * @returns {Promise<Object>}
         */

    }, {
        key: 'updateRecord',
        value: function updateRecord(viewId, recordId, recordData) {
            if (!viewId) {
                throw new Error('view id must be supplied to updateRecord');
            }

            if (!recordId) {
                throw new Error('record id must be supplied to updateRecord');
            }

            return tvRequest.put('/openapi/views/' + viewId + '/records/' + recordId, {
                body: {
                    data: [recordData]
                }
            });
        }

        /**
         * Delete record
         * @param {Number} viewId 
         * @param {Number} recordId 
         * @returns {Promise<Object>}
         */

    }, {
        key: 'deleteRecord',
        value: function deleteRecord(viewId, recordId) {
            if (!viewId) {
                throw new Error('view id must be supplied to deleteRecord');
            }
            if (!recordId) {
                throw new Error('record id must be supplied to deleteRecord');
            }

            return tvRequest.delete('/openapi/views/' + viewId + '/records/' + recordId);
        }

        /**
         * Delete all records in a view
         * @param {Number} viewId 
         * @returns {Promise<Object>}
         */

    }, {
        key: 'deleteAllRecordsInView',
        value: function deleteAllRecordsInView(viewId) {
            if (!viewId) {
                throw new Error('view id must be supplied to deleteAllRecordsInView');
            }

            return tvRequest.delete('/openapi/views/' + viewId + '/records/all');
        }

        /**
         * Get a file or image from a records
         * @param {Number} viewId 
         * @param {Number} recordId 
         * @param {String} fieldName 
         * @param {Object} options When getting an image file, you can specify widdth or maxDimension (Numbers) -- options are mutually exclusive
         * @returns {Promise<Object>}
         */

    }, {
        key: 'getFile',
        value: function getFile(viewId, recordId, fieldName) {
            var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            if (!viewId) {
                throw new Error('view id must be supplied to getFile');
            }
            if (!recordId) {
                throw new Error('record id must be supplied to getFile');
            }
            if (!fieldName) {
                throw new Error('field name must be supplied to getFile');
            }

            var requestDetails = {
                qs: {}
            };

            if (options.width) {
                requestDetails.qs.width = options.width;
            } else if (PushSubscriptionOptions.maxDimension) {
                requestDetails.qs.maxDimension = options.maxDimension;
            }

            return tvRequest.get('/openapi/views/' + viewId + '/records/' + recordId + '/files/' + fieldName, requestDetails);
        }

        /**
         * Attach a file to a record (can be used to overwrite existing file)
         * @param {Number} viewId 
         * @param {Number} recordId 
         * @param {String} fieldName name of field to add file to
         * @param {Binary String} file
         * @returns {Promise<Object>}
         */

    }, {
        key: 'attachFile',
        value: function attachFile(viewId, recordId, fieldName, file) {
            if (!viewId) {
                throw new Error('view id must be supplied to attachFile');
            }
            if (!recordId) {
                throw new Error('record id must be supplied to attachFile');
            }
            if (!fieldName) {
                throw new Error('field name must be supplied to attachFile');
            }
            if (!file) {
                throw new Error('file must be supplied to attachFile');
            }
            var formData = new FormData();
            formData.append('file', file);

            return tvRequest.post('/openapi/views/' + viewId + '/records/' + recordId + '/files/' + fieldName, {
                notJson: true,
                body: formData
            });
        }

        /**
         * Delete file from record
         * @param {Number} viewId 
         * @param {Number} recordId 
         * @param {String} fieldName name of field to remove file from
         * @returns {Promise<Object>}
         */

    }, {
        key: 'deleteFile',
        value: function deleteFile(viewId, recordId, fieldName) {
            if (!viewId) {
                throw new Error('view id must be supplied to deleteFile');
            }
            if (!recordId) {
                throw new Error('record id must be supplied to deleteFile');
            }
            if (!fieldName) {
                throw new Error('field name must be supplied to deleteFile');
            }

            return tvRequest.delete('/openapi/views/' + viewId + '/records/' + recordId + '/files/' + fieldName);
        }

        /**
         * Set access token for authentication
         * @param {String} accessToken 
         */

    }, {
        key: 'setAccessToken',
        value: function setAccessToken(accessToken) {
            auth.setAccessToken(accessToken);
        }

        /**
         * Get access token for authentication
         * @returns {String}
         */

    }, {
        key: 'getAccessToken',
        value: function getAccessToken() {
            return auth.getAccessToken();
        }

        /**
         * Get refresh token for authentication
         * @returns {String}
         */

    }, {
        key: 'getRefreshToken',
        value: function getRefreshToken() {
            return auth.getRefreshToken();
        }

        /**
         * Get user key (API key)
         * @returns {String}
         */

    }, {
        key: 'getUserKey',
        value: function getUserKey() {
            return auth.getUserKey();
        }
    }]);

    return TrackviaAPI;
}();

module.exports = TrackviaAPI;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var auth = __webpack_require__(0);
var getDefaultOptions = function getDefaultOptions() {
    return {
        requiresAuth: true,
        dataType: 'json',
        method: 'GET'
    };
};

var jsonToFormURL = function jsonToFormURL(json) {
    var params = [];
    for (var key in json) {
        if (json[key]) {
            params.push(encodeURIComponent(key) + '=' + encodeURIComponent(json[key]));
        }
    }
    return params.join('&');
};

var tvRequest = function () {
    function tvRequest() {
        _classCallCheck(this, tvRequest);
    }

    _createClass(tvRequest, [{
        key: 'makeRequest',
        value: async function makeRequest(endpoint, requestDetails, options) {
            options = Object.assign(getDefaultOptions(), options);
            var url = window.__tv_host + endpoint;

            var body = requestDetails.body || null;
            var queryParamObject = {};

            if (options.requiresAuth) {
                queryParamObject.access_token = auth.getAccessToken();
                queryParamObject.user_key = auth.getUserKey();
            }

            if (requestDetails.qs) {
                queryParamObject = Object.assign(queryParamObject, requestDetails.qs);
            }

            if (Object.keys(queryParamObject).length > 0) {
                url += '?' + jsonToFormURL(queryParamObject);
            }

            try {
                var initialResponse = await fetch(url, {
                    method: requestDetails.method,
                    headers: requestDetails.headers,
                    body: body
                });
                var contentType = initialResponse.headers.get("content-type");
                var response = contentType && contentType.indexOf("application/json") !== -1 ? await initialResponse.json() : { message: initialResponse };

                if (response.error && response.error_description.indexOf('Access token expired')) {
                    var retryOptions = Object.assign(options, {});
                    await auth.doRefreshToken();
                    return await this.makeRequest(retryOptions);
                } else if (response.error) {
                    throw new Error('url: ' + url + ', method: ' + options.method + ', response: ' + JSON.stringify(response));
                } else {
                    return response;
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    }, {
        key: 'get',
        value: function get(url, params, options) {
            var requestDetails = {
                method: 'GET'
            };

            if (params && params.file) {
                requestDetails.file = params.file;
            }

            if (params && params.qs) {
                requestDetails.qs = params.qs;
            }

            return this.makeRequest(url, requestDetails, options);
        }
    }, {
        key: 'post',
        value: function post(url, params, options) {
            var requestDetails = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (params && params.qs) {
                requestDetails.qs = params.qs;
            }

            if (params && params.body) {
                if (typeof params.body !== 'string' && !params.notJson) {
                    requestDetails.body = JSON.stringify(params.body);
                } else {
                    requestDetails.body = params.body;
                    delete requestDetails.headers['Content-Type'];
                }
            }

            return this.makeRequest(url, requestDetails, options);
        }
    }, {
        key: 'put',
        value: function put(url, params, options) {
            var requestDetails = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (params && params.qs) {
                requestDetails.qs = params.qs;
            }

            if (params && params.body) {
                if (typeof params.body !== 'string' && !params.notJson) {
                    requestDetails.body = JSON.stringify(params.body);
                } else {
                    requestDetails.body = params.body;
                    delete requestDetails.headers['Content-Type'];
                }
            }

            return this.makeRequest(url, requestDetails, options);
        }
    }, {
        key: 'delete',
        value: function _delete(url) {
            var requestDetails = {
                method: 'DELETE'
            };

            return this.makeRequest(url, requestDetails);
        }
    }]);

    return tvRequest;
}();

module.exports = new tvRequest();

/***/ })
/******/ ]);