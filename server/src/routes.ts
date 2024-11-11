import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { MutableMap, createTSMutableMap } from "./map";

type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;

const files: MutableMap<unknown> = createTSMutableMap();

/**
 * Retrieves and lists all saved guest records.
 * @param req - The request object.
 * @param res - The response object.
 */
export const listGuests = (_req: SafeRequest, res: SafeResponse): void => {
  const guests = files.values();
  res.send(JSON.stringify({ guests }));
};

/**
 * Saves the content of a file under a specified name.
 * @param req - The request object.
 * @param res - The response object.
 */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  const content = req.body.content;

  if (name === undefined || typeof name !== 'string' || content === undefined) {
    res.status(400).send(JSON.stringify({ error: 'Missing/invalid parameters' }));
    return;
  }

  const saved = files.contains(name);
  files.set(name, content);
  res.send(JSON.stringify({ saved: !saved }));
};

/**
 * Loads the most recent content saved under a specified file name.
 * @param req - The request object.
 * @param res - The response object.
 */
export const load = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);

  if (name === undefined) {
    res.status(400).send(JSON.stringify({ error: 'Missing name parameter' }));
    return;
  }

  const content = files.get(name);

  if (content === undefined) {
    res.status(404).send(JSON.stringify({ error: 'Invalid File' }));
    return;
  }

  res.send(JSON.stringify({ name, content }));
};

/**
 * Lists the names of all saved files.
 * @param req - The request object.
 * @param res - The response object.
 */
export const names = (_req: SafeRequest, res: SafeResponse): void => {
  const fileNames = files.keys();
  res.send(JSON.stringify({ names: fileNames }));
};

/**
 * Resets the files map, primarily for testing purposes.
 */
export const resetForTesting = (): void => {
  files.clear();
};

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give multiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string | undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
