import express, { Express } from "express";
//import { dummy } from './routes';
import bodyParser from 'body-parser';
import { save, load, names, listGuests} from "./routes";

// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/load", load);
app.get("/api/names", names)
app.get("/api/listGuests", listGuests)
app.post("/api/save", save);
app.listen(port, () => console.log(`Server listening on ${port}`));
