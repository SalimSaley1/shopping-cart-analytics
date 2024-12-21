import http from 'http';
import app from './app';
import normalizePort from './utils/normalize_port';
import errorHandler from './utils/error_handler';
import dotenv from "dotenv";

dotenv.config();

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

server.on('error', (error) => errorHandler(error, server));
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
