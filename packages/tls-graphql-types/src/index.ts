import type { DocumentNode, GraphQLSchema } from 'graphql';

export interface TCPOptions {
  tcpPort: number;
}

export type StringOrBuffer = string | Buffer;

export interface TLSOptions {
  tlsPort: number;
  cert: StringOrBuffer;
  key: StringOrBuffer;
}

export interface GraphQLServerOptions {
  schema: GraphQLSchema;
  rootValue?: any;
}

export interface HostOptions {
  host: string;
}

export type TLSGraphQLServerOptions = TCPOptions &
  TLSOptions &
  GraphQLServerOptions;

export type TLSGraphQLClientOptions = TCPOptions & TLSOptions & HostOptions;

export interface GraphQLOperationOptions {
  document: DocumentNode;
  variables?: Record<string, any>;
  operationName?: string;
}
