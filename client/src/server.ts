import { isRecord } from './record';
import { Guest, fromJson, toJson } from './guest';

/** Type of callback that receives the list of file names */
export type ListCallback = (names: string[]) => void;

/** 
 * Accesses the server endpoint /api/names to receive a list of files.
 * Passes the list to the given callback.
 * @param cb - Callback that accepts a string[] of file names as its parameter.
 *             Called when the server response is received and parsed.
 */
export const listFiles = (cb: ListCallback): void => {
  fetch("/api/names")
    .then((res) => doListResp(res, cb))
    .catch(() => doListError("failed to connect to the server"));
};


/** Type of callback that receives file contents (a Guest) and its name */
export type LoadCallback = (name: string, guest: Guest | null) => void;

/** 
 * Accesses the server endpoint /api/load, passing the given "name" as a query parameter,
 * and receives file contents for the specified file name.
 * Passes file contents to the given callback.
 * @param name - Name of the file to get contents of.
 * @param cb - Callback that accepts a file name and its contents.
 *             Called when the server response is received and parsed.
 */
export const loadFile = (name: string, cb: LoadCallback): void => {
  fetch("/api/load?name=" + encodeURIComponent(name))
    .then((res) => doLoadResp(name, res, cb))
    .catch(() => doLoadError("failed to connect to the server"));
}

/** Type of callback that accepts save notification for file with given name */
export type SaveCallback = (name: string, saved: boolean) => void;

/** Stores the contents of the given file on the server. */
/** 
 * Accesses the server endpoint /api/save, passing the given "name" and square file 
 * "contents" in the BODY of the request. Receives confirmation on completion.
 * Passes confirmation of save success to the given callback.
 * @param name - Name of the file to get contents of.
 * @param sq - Contents of the file to be saved.
 * @param cb - Callback that accepts a file name and its contents.
 *             Called when the server response is received and parsed.
 */
export const saveFile = (name: string, sq: Guest, cb: SaveCallback): void => {
  const body = {name: name, content: toJson(sq)};
  fetch("/api/save", {method: 'POST', body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}})
    .then((res) => doSaveResp(name, res, cb))
    .catch(() => doSaveError("failed to connect to the server"));
};

// Called when the server responds with a request for the file names.
const doListResp = (res: Response, cb: ListCallback): void => {
  if (res.status === 200) {
    res.json().then((val) => doListJson(val, cb))
      .catch(() => doListError("200 response is not JSON"));
  } else if (res.status === 400) {
    res.text().then(doListError)
      .catch(() => doListError("400 response is not text"));
  } else {
    doListError(`bad status code: ${res.status}`);
  }
};

// Called when the new question response JSON has been parsed.
const doListJson = (val: unknown, cb: ListCallback): void => {
  if (!isRecord(val) || !Array.isArray(val.names)) {
    console.error('Invalid JSON from /api/names', val);
    return;
  }

  const names: string[] = [];
  for (const name of val.names) {
    if (typeof name === 'string') {
      names.push(name);
    } else {
      console.error('Invalid name from /api/names', name);
      return;
    }
  }

  cb(names);
};

// Called if an error occurs trying to get a new question.
const doListError = (msg: string): void => {
  console.error(`Error fetching /api/names: ${msg}`);
};

// Called when the server responds to a request to load
const doLoadResp = (name: string, res: Response, cb: LoadCallback): void => {
  if (res.status === 200) {
    res.json().then((val) => doLoadJson(name, val, cb))
      .catch(() => doLoadError("200 response is not JSON"));
  } else if (res.status === 400) {
    res.text().then(doLoadError)
      .catch(() => doLoadError("400 response is not text"));
  } else {
    doLoadError(`bad status code: ${res.status}`);
  }
};

// Called when the load response JSON has been parsed.
const doLoadJson = (name: string, val: unknown, cb: LoadCallback): void => {
  if (!isRecord(val) || typeof val.name !== 'string' ||
      val.content === undefined) {
    console.error('Invalid JSON from /api/load', val);
    return;
  }

  if (val.content === null) {
    cb(name, null);
  } else {
    cb(name, fromJson(val.content));
  }
};

// Called if an error occurs trying to save the file
const doLoadError = (msg: string): void => {
  console.error(`Error fetching /api/load: ${msg}`);
};

// Called when the server responds to a request to save
const doSaveResp = (name: string, res: Response, cb: SaveCallback): void => {
  if (res.status === 200) {
    res.json().then((val) => doSaveJson(name, val, cb))
      .catch(() => doSaveError("200 response is not JSON"));
  } else if (res.status === 400) {
    res.text().then(doSaveError)
      .catch(() => doSaveError("400 response is not text"));
  } else {
    doSaveError(`bad status code: ${res.status}`);
  }
};

// Called when the save response JSON has been parsed.
const doSaveJson = (name: string, val: unknown, cb: SaveCallback): void => {
  if (!isRecord(val) || typeof val.saved !== 'boolean') {
    console.error('Invalid JSON from /api/save', val);
    return;
  }

  cb(name, val.saved);
};

// Called if an error occurs trying to save the file
const doSaveError = (msg: string): void => {
  console.error(`Error fetching /api/save: ${msg}`);
};
export type ListGuestsCallback = (guests: Guest[]) => void;

/**
 * Fetches the list of guests from the server.
 * Provides the retrieved list to the specified callback.
 * @param cb - A callback that receives an array of guests.
 *             Called upon successful retrieval of the list.
 */
export const listGuests = (cb: ListGuestsCallback): void => {
    fetch("/api/listGuests")
        .then((res) => handleGuestListResponse(res, cb))
        .catch(() => handleGuestListError("Failed to connect to the server"));
};

const handleGuestListResponse = (res: Response, cb: ListGuestsCallback): void => {
    if (res.status === 200) {
        res.json().then((val) => processGuestListJson(val, cb))
            .catch(() => handleGuestListError("200 response is not JSON"));
    } else if (res.status === 400) {
        res.text().then(handleGuestListError)
            .catch(() => handleGuestListError("400 response is not text"));
    } else {
        handleGuestListError(`Bad status code: ${res.status}`);
    }
};

const processGuestListJson = (val: unknown, cb: ListGuestsCallback): void => {
    if (!isRecord(val) || !Array.isArray(val.guests)) {
        console.error('Invalid JSON from /api/listGuests', val);
        return;
    }

    const guests: Guest[] = [];
    for (const guest of val.guests) {
      guests.push(fromJson(guest));
    }

    cb(guests);
};

const handleGuestListError = (msg: string): void => {
    console.error(`Error fetching /api/listGuests: ${msg}`);
};
