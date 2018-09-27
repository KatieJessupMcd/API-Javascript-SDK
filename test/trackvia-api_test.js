const expect = chai.expect;

const {
    ENVIRONMENT,
    USERNAME,
    PASSWORD,
    API_KEY,
    ACCESS_TOKEN,
    ACCOUNT_ID,
    APP_ID,
    APP_NAME,
    TABLE_ID,
    SINGLE_LINE_FIELD_NAME,
    DOCUMENT_FIELD_NAME,
    VIEW_ID,
    VIEW_NAME,
} = config;

console.log('testing');
console.log('trackviaapi', TrackviaAPI);
const api = new TrackviaAPI(API_KEY, ACCESS_TOKEN, ENVIRONMENT);

console.log(`~~~ Public-Web-SDK Test`);
console.log(`~~~ USER:  ${USERNAME}`);
console.log(`~~~ PASS:  ${PASSWORD}`);
console.log(`~~~ ENV:   ${ENVIRONMENT}`);
console.log(`~~~ KEY:   ${API_KEY}`);
console.log(`~~~ TOKEN: ${ACCESS_TOKEN}`);

describe('OAUTH and constructor', () => {
    describe('constructor method for TrackViaAPI SDK', () => {
        it('should throw error if API key is not passed in', () => {
            expect(() => new TrackviaAPI()).to.Throw(Error, 'Must provide API key to TrackviaAPI constructor');
        });
        it('should instantiate with just an apiKey', () => {
            expect(new TrackviaAPI(API_KEY, '', ENVIRONMENT).getUserKey()).to.equal(API_KEY);
        });
        it('should instantiate with an accessToken', () => {
            const tokenAPI = new TrackviaAPI(API_KEY, ACCESS_TOKEN, ENVIRONMENT);

            expect(tokenAPI.getUserKey()).to.equal(API_KEY);
            expect(tokenAPI.getAccessToken()).to.equal(ACCESS_TOKEN);
        });
    });
    describe('POST /oauth/token in login method with username and password', () => {
        it('should login with valid username and password', () => {
            api.login(USERNAME, PASSWORD)
                .then(() => {
                    expect(api.getAccessToken()).to.not.be.undefined;
                });
        });
        it('should throw error with incorrect username', () => {
            const notUsername = 'notmyusername';
            api.login(notUsername, PASSWORD)
                .catch((err) => {
                    expect(err).to.be.instanceOf(Error);
                });
        });
        it('should throw error with incorrect password', () => {
            const notPassword = 'notmypassword';
            api.login(USERNAME, notPassword)
                .catch((err) => {
                    expect(err).to.be.instanceOf(Error);
                });
        });
        it('should throw error with no username', () => {
            api.login(PASSWORD)
                .catch((err) => {
                    expect(err).to.be.instanceOf(Error);
                });
        });
        it('should throw error with no password', () => {
            api.login(USERNAME)
                .catch((err) => {
                    expect(err).to.be.instanceOf(Error);
                });
        });
        it('should throw error with no username and password', () => {
            api.login()
                .catch((err) => {
                    expect(err).to.be.instanceOf(Error);
                });
        });
    });
});

describe('APPS', () => {
    describe('GET /openapi/apps in getApps method', () => {
        it('should return array of apps', () => {
            api.getApps()
                .then(results => {
                    expect(results).to.be.a('array');
                    expect(results).to.have.length.above(0);
                })
        });
        it('should return app objects', () => {
            api.getApps()
                .then(results => {
                    expect(results[0]).to.have.property('name');
                    expect(results[0]).to.have.property('id');
                })
        })
    });

    describe('GET /openapi/apps in getAppByName method', () => {
        it('should return one app in an array', () => {
            api.getAppByName(APP_NAME)
                .then(result => {
                    expect(result).to.be.a('array');
                    expect(result).to.have.lengthOf(1);
                })
        });
        it('should return the matching app record', () => {                          
            api.getAppByName(APP_NAME)
                .then(result => {
                    expect(result[0].name).to.equal(APP_NAME);
                    expect(result[0].id).to.equal(parseInt(APP_ID));
                })
        });
    });
});

describe('USERS', () => {
    describe('GET /openapi/users in getUsers method', () => {
        it('should return users', () => {
            api.getUsers()
                .then((results) => {
                    expect(results).to.have.all.keys('structure', 'data', 'totalCount');
                });
        });
        it('should return objects in structure array', () => {
            api.getUsers()
                .then(results => {
                    expect(results.structure).to.have.length.above(0);
                    expect(results.structure).to.be.a('array');
                })
        });
        it('should return objects in data array', () => {
            api.getUsers()
                .then(results => {
                    expect(results.data).to.have.length.above(0);
                    expect(results.data).to.be.a('array');
                })
        });
        it('should return number in totalCount', () => {
            api.getUsers()
                .then(results => {
                    expect(results.totalCount).to.be.above(0);
                    expect(results.totalCount).to.be.a('number');
                })
        });
        it('should return useres based on paging parameters', () => {
            const paging = {
                start: 0,
                max: 1
            };
            api.getUsers(paging)
                .then(results => {
                    expect(results.totalcount).to.equal(1);
                })
        })
    });
    describe('POST /openapi/users in addUser method', () => {
        it('should give error message if no email is passed in', () => {
            const missingEmail = () => api.addUser({firstName: 'Katie', lastName: 'Scruggs'});
            expect(missingEmail).to.Throw(Error, 'email must be supplied when adding user');
        });
        it('should give error message if no firstName is passed in', () => {
            const missingFirstName = () => api.addUser({email: 'katie.scruggs@trackvia.com', lastName: 'Scruggs'});
            expect(missingFirstName).to.Throw(Error, 'firstName must be supplied when adding user');
        });
        it('should give error message if no lastName is passed in', () => {
            const missingLastName = () => api.addUser({email: 'katie.scruggs@trackvia.com', firstName: 'Katie'});
            expect(missingLastName).to.Throw(Error, 'lastName must be supplied when adding user');
        });
        it('should add a user', () => {
            // get random number so that a new user will be added each time instead of erroring
            const randomNumber = Math.floor(Math.random() * 10000);
            api.addUser({email: `katie.scruggs+test${randomNumber}@trackvia.com`, firstName: 'Katie', lastName: 'Scruggs'})
                .then(results => {
                    expect(results.data)
                })
        })
    });
});

describe('VIEWS', () => {
    before(async() => {
        const recordData = {
            [SINGLE_LINE_FIELD_NAME]: 'abc123'
        };
        await api.addRecord(VIEW_ID, recordData);
    });
    describe('GET /openapi/views in getViews method', () => {
        it('should return all the views', () => {
            api.getViews()
                .then(results => {
                    expect(results).to.be.a('array');
                    expect(results).to.have.length.above(0);
                })
        });
        it('should return view objects in that array', () => {
            api.getViews()
                .then(results => {
                    expect(results[0]).to.have.all.keys(['id', 'name', 'applicationName', 'default']);
                })
        });
    });
    describe('GET /openapi/views in getViewByName method', () => {
        it('should return an array of one view', () => {
            api.getViewByName(VIEW_NAME)
                .then(results => {
                    expect(results).to.be.a('array');
                    expect(results).to.have.lengthOf(1);
                })
        });
        it('should return the matching view record', () => {              
            api.getViewByName(VIEW_NAME)
                .then(results => {
                    expect(results[0].name).to.equal(VIEW_NAME);
                    expect(results[0].applicationName).to.equal(APP_NAME);
                    expect(results[0].default).to.equal(true);
                })
        });
        it('should throw error if no name is passed in', () => {
            const missingNameParam = () => api.getViewByName();
            expect(missingNameParam).to.Throw(Error, 'name must be supplied when getting view by name');
        });
    });
    describe('GET /openapi/views/{viewId}/find and GET /openapi/views/{viewId} in getView method', () => {
        it('should get a view without paging or query', () => {
            api.getView(VIEW_ID)
                .then(results => {
                    expect(results).to.have.all.keys(['structure', 'data', 'totalCount']);
                })
        });
        it('should return objects in structure array', () => {
            api.getView(VIEW_ID)
                .then(results => {
                    expect(results.structure).to.have.length.above(0);
                    expect(results.structure).to.be.a('array');
                })
        });
        it('should return objects in data array', () => {
            api.getView(VIEW_ID)
                .then(results => {
                    expect(results.data).to.have.length.above(0);
                    expect(results.data).to.be.a('array');
                })
        });
        it('should return number in totalCount', () => {
            api.getView(VIEW_ID)
                .then(results => {
                    expect(results.totalCount).to.be.above(0);
                    expect(results.totalCount).to.be.a('number');
                })
        });
        it('should get a view with a query', () => {
            api.getView(VIEW_ID, {}, 'abc123')
                .then(results => {
                    expect(results.data).to.have.length.above(0);
                })
        });
        it('should get one view with paging', () => {
            const paging = {
                start: 0,
                max: 1
            };
            api.getView(VIEW_ID, paging)
                .then(results => {
                    expect(results.data).to.have.lengthOf(1);
                })
        });
        it('should get one view with paging and a query', () => {
            const paging = {
                start: 0,
                max: 1
            };
            api.getView(VIEW_ID, paging, 'abc123')
                .then(results => {
                    expect(results.data).to.have.lengthOf(1);
                })
        });
        it('should fail without a VIEW_ID', () => {
            api.getView() 
                .catch(err => {
                    expect(typeof err).to.equal('object');
                })
        });
        it('should not find a bad query', () => {
            api.getView(VIEW_ID, {}, 'zzzzz')
                .then(results => {
                    expect(results.data).to.have.lengthOf(0);
                })
        });
    });
});


describe('RECORDS', () => {
    let recordId;

    describe('POST /openapi/views/{viewId}/records in addRecord method', () => {
        it('should add a record', () => {
            const recordData = {
                [SINGLE_LINE_FIELD_NAME]: 'hello'
            };
            return api.addRecord(VIEW_ID, recordData)
                .then(results => {
                    expect(results).to.have.all.keys(['structure', 'data', 'totalCount']);
                    expect(results.totalCount).to.be.above(0);
                    recordId = results.data[0].id;
                })
        });
        it('should not add a record with a bad field', () => {
            const recordData = {
                'WONT WORK': 'abc123'
            };
            api.addRecord(VIEW_ID, recordData)
                .catch(err => {
                    expect(err.body.message).to.equal('DENIED!!! - field "WONT WORK" either does not exist or you do not have access to it.');
                })
        });
    });
    
    describe('GET /openapi/views/{viewId}/records/{recordId} in getRecord method', () => {
        it('should get a record and return object with keys of structure and data', () => {
            api.getRecord(VIEW_ID, recordId)
                .then(results => {
                    expect(results).to.have.all.keys(['structure', 'data']);
                })
        });
        it('should return an array in the structure property', () => {
            api.getRecord(VIEW_ID, recordId)
                .then(results => {
                    expect(results.structure).to.be.a('array');
                    expect(results.structure).to.have.length.above(0);
                })
        });
        it('should return a record object in the data property', () => {
            api.getRecord(VIEW_ID, recordId)
                .then(results => {
                    expect(results.data).to.have.all.keys([SINGLE_LINE_FIELD_NAME, 'id', 'Last User', 'Updated', 'Created', 'Created By User', 'Last User(id)', 'Record ID', 'Created By User(id)']);
                })
        });
        it('should throw an error without a VIEW_ID', () => {
            const noViewId = () => api.getRecord(undefined, 386);
            expect(noViewId).to.throw('view id must be supplied to getRecord');
        });
        it('should throw an error without a recordId', () => {
            const noRecordId = () => api.getRecord(386, undefined);
            expect(noRecordId).to.throw('record id must be supplied to getRecord');
        });
    });
    
    describe('PUT /openapi/views/{viewId}/records/{recordId} in updateRecord method', () => {
        const validRecordData = {
            [SINGLE_LINE_FIELD_NAME]: 'new data'
        };
        const invalidRecordData = {
            notHere: 'data'
        };
        it('should update the record', () => {
            api.updateRecord(VIEW_ID, recordId, validRecordData)
                .then(results => {
                    expect(results).to.have.all.keys(['structure', 'data', 'totalCount']);
                    expect(results.data[0][SINGLE_LINE_FIELD_NAME]).to.equal('new data');
                })
        })
        it('should throw error if no view id is supplied', () => {
            const noViewId = () => api.updateRecord(undefined, recordId, invalidRecordData);
            expect(noViewId).to.Throw(Error, 'view id must be supplied to updateRecord');
        });
        it('should throw error if no record id is supplied', () => {
            const noRecordId = () => api.updateRecord(VIEW_ID, undefined, invalidRecordData);
            expect(noRecordId).to.Throw(Error, 'record id must be supplied to updateRecord');
        });
    });
    describe('DELETE /openapi/views/{viewId}/records/all in deleteAllRecordsInView', () => {
        it('should throw error if no view  id is supplied', () => {
            const noViewId = () => api.deleteAllRecordsInView();
            expect(noViewId).to.Throw(Error, 'view id must be supplied to deleteAllRecordsInView');
        });
        it('there should be records in the view', () => {
            api.getView(VIEW_ID)
                .then(result => {
                    expect(result.data).to.have.length.above(0);
                })
        });
        it('should delete all records in the view without throwing errors', () => {
            api.deleteAllRecordsInView(VIEW_ID)
                .then(result => {
                    expect('no errors').to.equal('no errors');
                })
        });
        it('there should be no records left in the view', () => {
            api.getView(VIEW_ID)
                .then(result => {
                    expect(result.data).to.have.lengthOf(0);
                })
        });
    });
    describe('DELETE /openapi/views/{viewId}/records/{recordId} in deleteRecord method', () => {
        let idToDelete;
        before(() => {
            const recordData = {
                [SINGLE_LINE_FIELD_NAME]: 'I will be deleted!'
            };
            return api.addRecord(VIEW_ID, recordData)
                .then((result) => {
                    idToDelete = result.data[0].id;
                })
        });
        it('the record to delete should exist', () => {
            api.getRecord(VIEW_ID, idToDelete)
                .then(result => {
                    expect(result.data).to.be.a('object');
                    expect(result.data).to.not.be.undefined;
                })
        });
        it('should delete the record without throwing errors', () => {
            api.deleteRecord(VIEW_ID, idToDelete)
                .then(result => {
                    expect('no errors thrown').to.equal('no errors thrown');
                })  
        });
        it('the record to delete should be gone', () => {
            api.getRecord(VIEW_ID, idToDelete)
                .catch(err => {
                    const errorBody = JSON.parse(err.body);
                    expect(errorBody.message).to.equal(`DENIED!!! - Record: ${idToDelete} either does not exist or you do not have access to it.`);
                })
        });
        it('should throw error if no view id is supplied', () => {
            const noViewId = () => api.deleteRecord(undefined, 4);
            expect(noViewId).to.Throw(Error, 'view id must be supplied to deleteRecord');
        });
        it('should throw error if no record id is supplied', () => {
            const noRecordId = () => api.deleteRecord(VIEW_ID, undefined);
            expect(noRecordId).to.Throw(Error, 'record id must be supplied to deleteRecord');
        });
    });
}); 

describe('RECORDS (file endpoints)', () => {
    let recordId;
    const viewId = VIEW_ID;
    const fieldName = DOCUMENT_FIELD_NAME;
    let file;

    before(() => {
        const recordData = {
            [SINGLE_LINE_FIELD_NAME]: 'abc123'
        };
        return api.addRecord(viewId, recordData)
            .then(result => {
                recordId = result.data[0].id
            })
    });
    describe('POST /openapi/views/{viewId}/records/{recordId}/files/{fieldName:.+} in attachFile', () => {
        it('should attach a file if one is provided through input', () => {
            const fileInput = document.getElementById('file-input');
            file = fileInput && fileInput.files && fileInput.files[0];
            
            if (file) {
                api.attachFile(viewId, recordId, fieldName, file)
                    .then(result => {
                        expect(result).to.have.all.keys(['structure', 'data']);
                    })
            }
            
        });
        it('should throw error if no view id is supplied', () => {
            const noViewId = () => api.attachFile(undefined, recordId, fieldName, file);
            expect(noViewId).to.throw('view id must be supplied to attachFile');
        });
        it('should throw error if no record id is supplied', () => {
            const noRecordId = () => api.attachFile(viewId, undefined, fieldName, file);
            expect(noRecordId).to.throw('record id must be supplied to attachFile');
        });
        it('should throw error if no field name is supplied', () => {
            const noFieldName = () => api.attachFile(viewId, recordId, undefined, file);
            expect(noFieldName).to.throw('field name must be supplied to attachFile');
        });
        it('should throw error if no file is supplied', () => {
            const noFile = () => api.attachFile(viewId, recordId, fieldName, undefined);
            expect(noFile).to.throw('file must be supplied to attachFile');
        });
    });
    describe('GET /openapi/views/{viewId}/records/{recordId}/files/{fieldName:.+} getFile', () => {
        it('should get a file', () => {
            api.getFile(viewId, recordId, fieldName)
                .then(result => {
                    expect(result).to.not.be.undefined;
                })
        });
        it('should throw error if no view id is supplied', () => {
            const noViewId = () => api.getFile(undefined, recordId, fieldName);
            expect(noViewId).to.throw('view id must be supplied to getFile');
        });
        it('should throw error if no record id is supplied', () => {
            const noRecordId = () => api.getFile(viewId, undefined, fieldName);
            expect(noRecordId).to.throw('record id must be supplied to getFile');
        });
        it('should throw error if no field name is supplied', () => {
            const noFieldName = () => api.getFile(viewId, recordId, undefined);
            expect(noFieldName).to.throw('field name must be supplied to getFile');
        });
    });
    describe('DELETE /openapi/views/{viewId}/records/{recordId}/files/{fieldName:.+} deleteFile', () => {
        it('should delete a file', () => {
            api.deleteFile(viewId, recordId, DOCUMENT_FIELD_NAME)
                .then(() => {
                    return api.getFile(viewId, recordId, DOCUMENT_FIELD_NAME)
                        .catch(err => {
                            const errorBody = JSON.parse(err.body);
                            expect(errorBody.message).to.equal('The resource you requested could not be found.File does not exist.');
                            expect(errorBody.name).to.equal('notFound');
                            expect(errorBody.code).to.equal('404');
                        })
                });
        });
        it('should throw error if no view id is supplied', () => {
            const noViewId = () => api.deleteFile(undefined, recordId, fieldName);
            expect(noViewId).to.throw('view id must be supplied to deleteFile');
        });
        it('should throw error if no record id is supplied', () => {
            const noRecordId = () => api.deleteFile(viewId, undefined, fieldName);
            expect(noRecordId).to.throw('record id must be supplied to deleteFile');
        });
        it('should throw error if no field name is supplied', () => {
            const noFieldName = () => api.deleteFile(viewId, recordId, undefined);
            expect(noFieldName).to.throw('field name must be supplied to deleteFile');
        });
    });
});
