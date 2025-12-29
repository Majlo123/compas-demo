import { generateSchema } from '@anatine/zod-openapi';
import config from 'config/config';
import * as Package from 'docs/package';
import swaggerTheme from 'docs/theme';
import { Request, Response, Router } from 'express';
import fs from 'fs';
import { StatusCode } from 'status-code-enum';
import swaggerUi from 'swagger-ui-express';
import { ZodTypeAny } from 'zod';
// eslint-disable-next-line no-restricted-imports
import { Role } from '../../../shared/auth.types';

export type EndpointParam = {
  name: string;
  in?: 'path' | 'query';
  type?: 'string' | 'number' | 'boolean' | 'integer' | 'array';
  items?: { type: string };
  required?: boolean;
  description?: string;
};

export type EndpointMeta = {
  name: string;
  desc: string;
  basePath?: string;
  path: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';

  params?: EndpointParam[];
  requestBodySchema?: ZodTypeAny;
  requestBodyExample?: any;
  querySchema?: ZodTypeAny;
  responses?: {
    code: StatusCode;
    desc: string;
    schema?: ZodTypeAny;
  }[];
  authorize?: boolean;
  allowedRoles?: Role[];
  functionName: string;
  noCacheHeaders?: boolean;
  requireApiKey?: boolean;
};

export const swaggerJson = {
  openapi: '3.0.3',
  info: {
    title: 'Acutro',
    description: 'Acutro API documentation',
    version: '0.0.1',
  },
  servers: [] as any[],
  paths: {} as any,
  headers: {
    'x-api-key': config.serviceApiKey,
  },
  components: {
    securitySchemes: {
      TokenAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'token',
        description: 'JWT token passed in the `token` header',
      },
      JobApiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description: 'API key used to trigger internal jobs',
      },
    },
  },
};

const existingSwaggerComponents: any = {};

const pickPreferredSchema = (schema: any): any => {
  if (!Array.isArray(schema.oneOf)) {
    return schema;
  }

  const preferred = schema.oneOf.find((s: any) =>
    Array.isArray(s.type) ? s.type.includes('array') : s.type === 'array',
  );

  return preferred ?? schema.oneOf[0];
};

const normalizeSchema = (originalSchema: any): any => {
  const preferredSchema = pickPreferredSchema(originalSchema);

  const normalizedTypeSchema = Array.isArray(preferredSchema.type)
    ? { ...preferredSchema, type: preferredSchema.type[0] }
    : preferredSchema;

  if (normalizedTypeSchema.items?.type && Array.isArray(normalizedTypeSchema.items.type)) {
    return {
      ...normalizedTypeSchema,
      items: {
        ...normalizedTypeSchema.items,
        type: normalizedTypeSchema.items.type[0],
      },
    };
  }

  return normalizedTypeSchema;
};

// https://github.com/anatine/zod-plugins/blob/main/packages/zod-openapi/README.md
export const queryParametersFromZod = (zodSchema: ZodTypeAny): any[] => {
  const jsonSchema = generateSchema(zodSchema);
  const { properties, required = [] } = jsonSchema;

  const params: any[] = [];

  if (!properties) {
    return params;
  }

  Object.entries(properties).forEach(([name, schema]: [string, any]) => {
    const { description, ...baseSchema } = schema;
    const paramsProps: any = {};

    if (baseSchema.type === 'object') {
      paramsProps.style = 'deepObject';
    }

    const finalSchema = normalizeSchema({ ...baseSchema });

    params.push({
      in: 'query',
      name,
      required: required.includes(name),
      description,
      ...paramsProps,
      style: finalSchema.type === 'array' ? 'form' : paramsProps.style,
      explode: finalSchema.type === 'array',
      schema: finalSchema,
    });
  });

  return params;
};

export const registerSwaggerSchema = (name: string, zodSchema: ZodTypeAny): void => {
  const swagger = generateSchema(zodSchema, existingSwaggerComponents);
  existingSwaggerComponents[name] = swagger;
};

export const registerSwaggerPath = (meta: EndpointMeta): void => {
  const fullPath = `${meta.basePath || ''}${meta.path}`.replace(/\/+/g, '/');

  const path = fullPath
    .split('/')
    .map((part) => (part.startsWith(':') ? `{${part.substring(1)}}` : part))
    .join('/');

  if (!swaggerJson.paths[path]) {
    swaggerJson.paths[path] = {};
  }

  if (swaggerJson.paths[path][meta.method]) {
    throw new Error(`Path ${meta.method} ${path} was defined before`);
  }

  const tag = meta.basePath?.replace(/^\//, '') || 'default';

  swaggerJson.paths[path][meta.method] = {
    summary: meta.name,
    description: `${meta.desc}`,
    tags: [tag],
  };

  if (meta.params) {
    swaggerJson.paths[path][meta.method].parameters = [];

    meta.params.forEach((param) => {
      swaggerJson.paths[path][meta.method].parameters.push({
        name: param.name,
        in: param.in ?? 'path', // default to 'path'
        required: param.required ?? (param.in === 'path' || !param.in), // default: required if it's a path param
        schema: {
          type: param.type ?? 'string',
        },
        description: param.description ?? `${param.in ?? 'path'} parameter: ${param.name}`,
      });
    });
  }

  if (meta.querySchema) {
    if (!swaggerJson.paths[path][meta.method].parameters) {
      swaggerJson.paths[path][meta.method].parameters = [];
    }

    swaggerJson.paths[path][meta.method].parameters.push(
      ...queryParametersFromZod(meta.querySchema),
    );
  }

  if (meta.requireApiKey) {
    swaggerJson.paths[path][meta.method].security = [{ JobApiKey: [] }];
  } else if (meta.authorize) {
    swaggerJson.paths[path][meta.method].security = [{ TokenAuth: [] }];
  }

  if (!meta.responses) {
    swaggerJson.paths[path][meta.method].responses = {
      '200': {
        description: 'Successful operation',
      },
    };
  }

  if (meta.responses) {
    swaggerJson.paths[path][meta.method].responses = {};

    meta.responses.forEach((response) => {
      swaggerJson.paths[path][meta.method].responses[response.code] = {
        description: response.desc,
      };

      if (response.schema) {
        swaggerJson.paths[path][meta.method].responses[response.code].content = {
          'application/json': {
            schema: generateSchema(response.schema),
          },
        };
      }
    });
  }

  if (meta.requestBodySchema) {
    const requestBodyContent: any = {
      schema: generateSchema(meta.requestBodySchema),
    };

    if (meta.requestBodyExample) {
      requestBodyContent.example = meta.requestBodyExample;
    }

    swaggerJson.paths[path][meta.method].requestBody = {
      description: 'Request body',
      content: {
        'application/json': requestBodyContent,
      },
    };
  }
};

export const setupSwagger = (_router: Router, endpointsMeta: EndpointMeta[]): void => {
  endpointsMeta.forEach((meta) => {
    registerSwaggerPath(meta);
  });
};

export const swaggerDocs = (
  app: Router,
  meta: {
    title: string;
    description: string;
    version?: string;
    serverUrl: string;
  },
): void => {
  swaggerJson.info.title = meta.title;
  swaggerJson.info.description = meta.description;
  swaggerJson.info.version = meta.version || Package.version();
  swaggerJson.servers.push({ url: meta.serverUrl });
  swaggerJson.components = swaggerJson.components || {};
  swaggerJson.components.securitySchemes = {
    TokenAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'token',
      description: 'JWT token passed in the `token` header',
    },
    JobApiKey: {
      type: 'apiKey',
      in: 'header',
      name: 'x-api-key',
      description: 'API key for triggering internal scheduled jobs',
    },
  };

  fs.writeFileSync('swagger.json', JSON.stringify(swaggerJson));
  const swaggerDocument = swaggerJson;

  app.use(
    '/docs',
    // @ts-ignore Express is complaining about swaggerUI.serve
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, undefined, undefined, swaggerTheme),
  );

  app.get('/docs.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });
};
