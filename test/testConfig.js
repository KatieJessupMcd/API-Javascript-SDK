/** 
 * Copy and paste the following into a file called testConfig.js in this test folder
 * and fill out the information below.
*/

/**
 * For this test suite, you will need a TrackVia account with an API Key, an app, and a table
 * The table must have two fields: one Single Line field and one Document field
 * For screenshots of the table setup, open test/testInstructions.html
 * All of the names (case sensitive) and IDs are configurable below:
 */

 /** After you add this information, type "npm test" in your console.
 */

const config = {
    // Choose the environment and account you want to test with
    // Make sure this account has an API Key.
    ENVIRONMENT: 'https://go.trackvia.com:443', // currently production
    USERNAME: 'katie.scruggs+test@trackvia.com',
    PASSWORD: 'Test12345',
    API_KEY: 'b12bf2f4f034885d4cd4671d9c921da2',
    ACCESS_TOKEN: '/lmfnO9zt1SdK3zsXVkfEXIWbnTrGfYrbtsKFltcneCbMLRJBJ0vk6GNLkQoVUniKPy/qEjYr4PwcLUpOMU2QW6rU0N8n8nm7sC6eiqcHmwLEXXpCFUnE3CU9I/aCShkyKP09g0xtTqvhIsBARDECSfCNm5uBeFr5FIltoqMBR+4eU8ghiluRyLxRu6RmU3CZumvhsX4E5WlRJLgUQwpv+8Ehyjh36aORPke7yPa01M=',
    ACCOUNT_ID: 22780,

    // Create a test app and enter the app's ID and name (case sensitive) here
    APP_ID: 3,
    APP_NAME: 'TEST APP',

    // Create a test table and enter the table's ID here
    TABLE_ID: 10,

    // Create a single line field on your test table and enter the name of the field (case sensitive) here
    SINGLE_LINE_FIELD_NAME: 'SINGLE LINE TEST',

    // Create a document field on your test table and enter the name of the field (case sensitive) here
    DOCUMENT_FIELD_NAME: 'DOCUMENT TEST',

    // Go to the default view of your test table and enter the ID and name (case sensitive) of that view here
    // The name of the default view is 'Default {table name} View' (even though it looks different in TrackVia)
    VIEW_ID: 5,
    VIEW_NAME: 'Default TEST TABLE View'
};

module.exports = config;

/**
 * Endpoints not yet in SDK and therefore not currently tested:
 * POST /openapi/views/{viewId}/records/create_one (RECORDS, create a record with a file to the given field name)
 * GET /openapi/integrations (INTEGRATIONS, get all integrations)
 * GET /openapi/integrations/{microserviceId}/invoke (INTEGRATIONS, invoke an integration with a GET)
 * POST /openapi/integrations/{microserviceId}/invoke (INTEGRATIONS, invoke an integration with a POST, can be multi-part or JSON)
 */
