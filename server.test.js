const request = require("supertest");
const { findItemInArrayByProperty, startServer } = require('./server');
let server;

beforeEach(async () => {
    // Starts the server before each test runs (even when it's not used)
    server = await startServer();
});

afterEach(async () => {
    // Closes the server after each test runs
    await server.close();
});

test('findItemInArrayByProperty must return the first occurence in the array by a key and value', () => {
    const targetItem = { targetKey: 'target value' };
    const array = [{ someKey: 'some value' }, targetItem, { targetKey: 'some other value' }];
    expect(findItemInArrayByProperty(array, 'targetKey', 'target value')).toBe(targetItem);
});

test('findItemInArrayByProperty must return null if it can\'t find the item in the array', () => {
    const array = [{ someKey: 'some value' }, { someOtherKey: 'some other value' }];
    expect(findItemInArrayByProperty(array, 'targetKey', 'target value')).toBe(undefined);
});

test('GET /games must respond with HTTP status 400 when it is called without id, game or designer params', async () => {
    const response = await request(server).get('/games')
    expect(response.status).toBe(400);
});

test('GET /games must find a game by id', async () => {
    const response = await request(server).get('/games?id=1')
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
        "data": [
            {
                "id": "1",
                "name": "Catan",
                "year": "1995",
                "designer": "Klaus Teuber"
            }
        ]
    });
});

test('GET /games must find a game by name', async () => {
    const response = await request(server).get('/games?name=Catan')
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
        "data": [
            {
                "id": "1",
                "name": "Catan",
                "year": "1995",
                "designer": "Klaus Teuber"
            }
        ]
    });
});

test('GET /games must find a game by designer', async () => {
    const response = await request(server).get('/games?designer=Klaus Teuber')
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
        "data": [
            {
                "id": "1",
                "name": "Catan",
                "year": "1995",
                "designer": "Klaus Teuber"
            }
        ]
    });
});

test('GET /games must respond with HTTP status code 404 if it can\'t find a game', async () => {
    // const server = await startServer();

    const response = await request(server).get('/games?id=5')
    expect(response.status).toBe(404);
});