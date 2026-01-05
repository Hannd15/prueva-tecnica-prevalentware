import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Prueba Técnica API',
      version: '1.0.0',
      description: 'Documentación de la API para la prueba técnica Fullstack',
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
  apis: ['./pages/api/**/*.ts'], // Ruta a los archivos donde viven los JSDoc OpenAPI
};

export const spec = swaggerJsdoc(options);
