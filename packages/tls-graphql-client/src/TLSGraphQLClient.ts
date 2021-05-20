import { EventEmitter } from 'events';
import net from 'net';
import tls, { TLSSocket } from 'tls';

import {
  TLSGraphQLClientOptions,
  GraphQLOperationOptions,
} from '@tls-graphql/types';
import { socketDataToJSONArray, stringifyData } from '@tls-graphql/utils';
import debug from 'debug';
import { nanoid } from 'nanoid';

const logger = debug('@tls-graphql:client');

class TLSGraphQLClient extends EventEmitter {
  private error: number = 0;

  private serverCert: string;

  private tlsSocket: TLSSocket;

  private tlsPort: number;

  private tcpPort: number;

  private host: string;

  private started: boolean;

  constructor({ tcpPort, tlsPort, host }: TLSGraphQLClientOptions) {
    super();
    this.tlsPort = tlsPort;
    this.host = host;
    this.tcpPort = tcpPort;
  }

  private defineServerCert(): void {
    const self = this;
    logger('download cert from server');
    const socket = net.connect({ port: this.tcpPort });

    socket.on('data', (data) => {
      logger('set server cert in client');
      self.serverCert = data.toString();
      self.emit('serverCertDefined');
      socket.end();
      socket.destroy();
    });

    socket.on('error', this.onAnyError);
  }

  private initTLSSocket = (): void => {
    const self = this;
    this.tlsSocket = tls.connect(
      this.tlsPort,
      this.host,
      { ca: [this.serverCert], rejectUnauthorized: false },
      () => {
        let data = '';
        self.tlsSocket.on('data', (chunk: Buffer) => {
          data += chunk.toString();
          const [operations, restData] = socketDataToJSONArray(data);
          data = restData;
          operations.forEach(({ id, ...rest }) => {
            this.emit(`callback:${id}`, { ...rest });
          });
        });
      }
    );

    this.tlsSocket.on('error', this.onAnyError);
  };

  private onAnyError(e: Error): void {
    logger(e);
    if (this.error < 9) {
      this.error += 1;
      return;
    }
    this.started = false;
  }

  start() {
    this.started = true;
    this.on('serverCertDefined', this.initTLSSocket);
    this.defineServerCert();
  }

  stop(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.started) {
        return function f() {
          if (!this.tlsSocket) {
            return setTimeout(f, 200);
          }
          this.tlsSocket.end();
          this.tlsSocket.destroy();
          return resolve(true);
        };
      }
      return resolve(false);
    });
  }

  query({
    document,
    variables,
    operationName,
  }: GraphQLOperationOptions): Promise<any> {
    const self = this;
    const data = document.loc && document.loc.source.body;
    const id = nanoid();
    return new Promise((resolve) => {
      if (self.tlsSocket) {
        self.on(`callback:${id}`, (responseData) => {
          resolve(responseData);
        });

        self.tlsSocket.write(
          `${stringifyData({
            id,
            data,
            variables,
            operationName,
          })}:!:`
        );
        return;
      }
      setTimeout(() => {
        self.query({ document, variables, operationName }).then((response) => {
          resolve(response);
        });
      }, 200);
    });
  }
}

export default TLSGraphQLClient;
