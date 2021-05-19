import net from 'net';
import tls from 'tls';

import {
  GraphQLServerOptions,
  StringOrBuffer,
  TCPOptions,
  TLSGraphQLServerOptions,
  TLSOptions,
} from '@tls-graphql/types';
import debug from 'debug';

import GraphQLExecuteStream from './GraphQLExecuteStream';

import type { GraphQLSchema } from 'graphql';

const tcpLogger = debug('ac-server:tcp');
const tlsLogger = debug('ac-server:tls');

class TLSGraphQLServer {
  private tcpPort: number;

  private tlsPort: number;

  private cert: StringOrBuffer;

  private key: StringOrBuffer;

  private schema: GraphQLSchema;

  private rootValue: any;

  private tcpServer: net.Server;

  private tlsServer: tls.Server;

  constructor({
    tcpPort,
    tlsPort,
    cert,
    key,
    schema,
    rootValue = undefined,
  }: TLSGraphQLServerOptions) {
    this.setGraphQLOptions({ schema, rootValue });
    this.setTCPOptions({ tcpPort });
    this.setTLSOptions({ tlsPort, cert, key });
    this.init();
  }

  private setGraphQLOptions({ schema, rootValue }: GraphQLServerOptions) {
    this.schema = schema;
    this.rootValue = rootValue;
  }

  private setTCPOptions({ tcpPort }: TCPOptions) {
    this.tcpPort = tcpPort;
  }

  private setTLSOptions({ tlsPort, cert, key }: TLSOptions) {
    this.tlsPort = tlsPort;
    this.cert = cert;
    this.key = key;
  }

  private init() {
    this.initTCPServer();
    this.initTLSServer();
  }

  private initTCPServer() {
    this.tcpServer = net
      .createServer({}, (s) => {
        s.write(this.cert);
        tcpLogger('client has downloaded the certificate');
      })
      .on('error', (err) => {
        tcpLogger(err);
      });
  }

  private initTLSServer() {
    const { key, cert } = this;
    this.tlsServer = tls
      .createServer(
        {
          key,
          cert,
          rejectUnauthorized: false,
        },
        (socket) => {
          const graphqlExecuteStream = new GraphQLExecuteStream({
            schema: this.schema,
            rootValue: this.rootValue,
          });

          socket.pipe(graphqlExecuteStream);
          graphqlExecuteStream.pipe(socket);
        }
      )
      .on('tlsClientError', (err) => {
        tlsLogger(`tlsClientError ${err}`);
      });
  }

  listen() {
    this.tcpServer.listen(this.tcpPort, () => {
      tcpLogger(`tcp ready on ${this.tcpPort}`);
    });
    this.tlsServer.listen(this.tlsPort, () => {
      tlsLogger(`tls ready on ${this.tlsPort}`);
    });
    return this;
  }

  close() {
    this.tcpServer.close();
    this.tlsServer.close();
    return this;
  }
}

export default TLSGraphQLServer;
