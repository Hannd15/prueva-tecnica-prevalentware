import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Prueba Técnica API',
      version: '1.0.0',
      description: 'Documentación de la API para la prueba técnica Fullstack',
    },
    tags: [
      { name: 'Auth', description: 'Autenticación (Better Auth)' },
      { name: 'Docs', description: 'Documentación OpenAPI/Swagger' },
      { name: 'Me', description: 'Información del usuario autenticado' },
      { name: 'Roles', description: 'Roles del sistema' },
      { name: 'Users', description: 'Gestión de usuarios' },
      { name: 'Movements', description: 'Movimientos financieros' },
      { name: 'Reports', description: 'Reportes' },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'better-auth.session_token',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
          required: ['error'],
          additionalProperties: false,
        },
        Role: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
          required: ['id', 'name'],
          additionalProperties: false,
        },
        UserListItem: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: ['string', 'null'] },
            email: { type: 'string' },
            phone: { type: ['string', 'null'] },
            roleName: { type: 'string' },
          },
          required: ['id', 'email', 'roleName'],
          additionalProperties: false,
        },
        PaginatedUsersResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/UserListItem' },
            },
            meta: {
              type: 'object',
              properties: {
                total: { type: 'integer' },
                page: { type: 'integer' },
                pageSize: { type: 'integer' },
                totalPages: { type: 'integer' },
              },
              required: ['total', 'page', 'pageSize', 'totalPages'],
              additionalProperties: false,
            },
          },
          required: ['data', 'meta'],
          additionalProperties: false,
        },
        UserDetail: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: ['string', 'null'] },
            email: { type: 'string' },
            phone: { type: ['string', 'null'] },
            roleId: { type: 'string' },
          },
          required: ['id', 'email', 'roleId'],
          additionalProperties: false,
        },
        MovementListItem: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            concept: { type: 'string' },
            amount: { type: 'number' },
            date: { type: 'string', format: 'date-time' },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
            userName: { type: ['string', 'null'] },
          },
          required: ['id', 'concept', 'amount', 'date', 'type', 'userName'],
          additionalProperties: false,
        },
        PaginatedMovementsResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/MovementListItem' },
            },
            meta: {
              type: 'object',
              properties: {
                total: { type: 'integer' },
                page: { type: 'integer' },
                pageSize: { type: 'integer' },
                totalPages: { type: 'integer' },
              },
              required: ['total', 'page', 'pageSize', 'totalPages'],
              additionalProperties: false,
            },
            summary: {
              type: 'object',
              properties: {
                totalIncomes: { type: 'number' },
                totalExpenses: { type: 'number' },
                balance: { type: 'number' },
              },
              required: ['totalIncomes', 'totalExpenses', 'balance'],
              additionalProperties: false,
            },
          },
          required: ['data', 'meta', 'summary'],
          additionalProperties: false,
        },
        ChartDataPoint: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              description: 'Fecha en formato YYYY-MM-DD',
            },
            incomes: { type: 'number' },
            expenses: { type: 'number' },
          },
          required: ['date', 'incomes', 'expenses'],
          additionalProperties: false,
        },
        ReportsStats: {
          type: 'object',
          properties: {
            summary: {
              type: 'object',
              properties: {
                totalIncomes: { type: 'number' },
                totalExpenses: { type: 'number' },
                balance: { type: 'number' },
              },
              required: ['totalIncomes', 'totalExpenses', 'balance'],
              additionalProperties: false,
            },
            chartData: {
              type: 'array',
              items: { $ref: '#/components/schemas/ChartDataPoint' },
            },
          },
          required: ['summary', 'chartData'],
          additionalProperties: false,
        },
        PermissionsResponse: {
          type: 'object',
          properties: {
            permissions: {
              type: 'array',
              items: { type: 'string' },
            },
          },
          required: ['permissions'],
          additionalProperties: false,
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: [
    path.join(process.cwd(), 'pages/api/**/*.ts'),
    path.join(process.cwd(), 'lib/swagger.ts'),
  ],
};

export const spec = swaggerJsdoc(options);
