import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { save, load, names, resetForTesting } from './routes';

describe('save', function() {
  beforeEach(function() {
    resetForTesting();
  });

  it('Saves a new file returns true', function() {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/api/save',
      body: { name: 'file1', content: 'file content' },
    });
    const res = httpMocks.createResponse();

    save(req, res);

    assert.deepStrictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(JSON.parse(res._getData()), { saved: true });
  });

  it('Saves an existing file returns false', function() {
    const saveReq = httpMocks.createRequest({
      method: 'POST',
      url: '/api/save',
      body: { name: 'file1', content: 'file content' },
    });
    const saveRes = httpMocks.createResponse();
    save(saveReq, saveRes);

    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/api/save',
      body: { name: 'file1', content: 'updated content' },
    });
    const res = httpMocks.createResponse();

    save(req, res);

    assert.deepStrictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(JSON.parse(res._getData()), { saved: false });
  });

  it('Handles missing or invalid parameters', function() {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/api/save',
      body: { name: 'file1' },
    });
    const res = httpMocks.createResponse();

    save(req, res);

    assert.deepStrictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(JSON.parse(res._getData()), { error: 'Missing/invalid parameters' });
  });
});

describe('load', function() {
  beforeEach(function() {
    resetForTesting();
  });

  it('Loads the content of an existing file', function() {
    const saveReq = httpMocks.createRequest({
      method: 'POST',
      url: '/api/save',
      body: { name: 'file1', content: 'file content' },
    });
    const saveRes = httpMocks.createResponse();
    save(saveReq, saveRes);

    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/api/load',
      query: { name: 'file1' },
    });
    const res = httpMocks.createResponse();

    load(req, res);

    assert.deepStrictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(JSON.parse(res._getData()), { name: 'file1', content: 'file content' });
  });

  it('Handles missing name parameter', function() {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/api/load',
    });
    const res = httpMocks.createResponse();

    load(req, res);

    assert.deepStrictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(JSON.parse(res._getData()), { error: 'Missing name parameter' });
  });

  it('Handles loading non-existent file', function() {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/api/load',
      query: { name: 'nonexistent' },
    });
    const res = httpMocks.createResponse();

    load(req, res);

    assert.deepStrictEqual(res._getStatusCode(), 404);
    assert.deepStrictEqual(JSON.parse(res._getData()), { error: 'Invalid File' });
  });
});

describe('names', function() {
  beforeEach(function() {
    resetForTesting();
  });

  it('Returns an empty array if no files exist', function() {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/api/names',
    });
    const res = httpMocks.createResponse();

    names(req, res);

    assert.deepStrictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(JSON.parse(res._getData()), { names: [] });
  });

  it('Returns an array of file names', function() {
    const saveReq1 = httpMocks.createRequest({
      method: 'POST',
      url: '/api/save',
      body: { name: 'file1', content: 'file content 1' },
    });
    const saveRes1 = httpMocks.createResponse();
    save(saveReq1, saveRes1);

    const saveReq2 = httpMocks.createRequest({
      method: 'POST',
      url: '/api/save',
      body: { name: 'file2', content: 'file content 2' },
    });
    const saveRes2 = httpMocks.createResponse();
    save(saveReq2, saveRes2);

    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/api/names',
    });
    const res = httpMocks.createResponse();

    names(req, res);

    assert.deepStrictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(JSON.parse(res._getData()), { names: ['file1', 'file2'] });
  });
});
