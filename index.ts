import express, {Express, Request, Response} from 'express';
import path from 'path'
import { filterDataApiRecruit } from './src/parte1/filterDataApiRecruit';
import { convertCsvToJson } from './src/parte2/csvToJson';
const PORT = process.env.PORT || 8080;
const app: Express = express();

app.use(express.urlencoded({extended: true}));
app.use('/dist', express.static('dist'));

app.get('/resumen/:date', (req: Request, res: Response) => filterDataApiRecruit(req, res) );

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, './dist/csv.html'));
});
app.post('/', (req: Request, res: Response) => convertCsvToJson(req, res) );

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = server;
