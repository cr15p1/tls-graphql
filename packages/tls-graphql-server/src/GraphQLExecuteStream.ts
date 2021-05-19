/* eslint-disable import/no-extraneous-dependencies */
import { Stream } from 'stream';

import { GraphQLServerOptions } from '@tls-graphql/types';
import { socketDataToJSONArray, stringifyData } from '@tls-graphql/utils';
import {
  DocumentNode,
  execute,
  GraphQLError,
  GraphQLSchema,
  parse,
  validate,
} from 'graphql';

class GraphQLExecuteStream extends Stream.Transform {
  data: string = '';

  schema: GraphQLSchema;

  rootValue: any;

  constructor({ schema, rootValue }: GraphQLServerOptions) {
    super();
    this.schema = schema;
    this.rootValue = rootValue;
  }

  // eslint-disable-next-line no-underscore-dangle
  _transform(chunk, encoding, done) {
    this.data += chunk.toString('utf8');
    const [operations, restData] = socketDataToJSONArray(this.data);
    this.data = restData;
    operations.forEach(({ id, data, variables, operationName }) => {
      const promiseOrParsed = this.parseOperation({
        data,
        variables,
        operationName,
      });
      this.send(id, promiseOrParsed);
    });
    done();
  }

  private parseOperation({
    data,
    variables,
    operationName,
  }: {
    data: any;
    variables: Record<string, any>;
    operationName: string;
  }): Object | Promise<Object> {
    const document = parse(data);
    const validationErrors = this.validateOperation(document);
    if (validationErrors) {
      return { errors: validationErrors };
    }
    return execute({
      document,
      schema: this.schema,
      rootValue: this.rootValue,
      operationName,
      variableValues: variables,
    });
  }

  private validateOperation(
    document: DocumentNode
  ): readonly GraphQLError[] | null {
    const errors = validate(this.schema, document);
    if (errors.length > 0) {
      return errors;
    }
    return null;
  }

  private send(id, responseOrPromise: Object | Promise<Object>) {
    if ('then' in responseOrPromise) {
      return responseOrPromise.then((response) => {
        this.push(stringifyData(response));
      });
    }
    return this.push(stringifyData({ id, data: responseOrPromise }));
  }
}

export default GraphQLExecuteStream;
