import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Prueba Técnica API',
      version: '1.0.0',
      description: 'API documentation for the Fullstack Technical Test',
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'better-auth.session_token',
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./pages/api/**/*.ts'], // Path to the API docs
};

export const spec = swaggerJsdoc(options);
