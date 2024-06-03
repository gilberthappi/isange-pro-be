// swaggerConfig.js
export const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'AJEMEL API',
        version: '1.0.0',
        description: 'Ajemel  API Documentation',
      },
      servers: [
        {
          url: 'http://localhost:100/api/v1',
        },
        {
          url: 'https://ajemel.onrender.com/api/v1',
        },
      ],
      
    },
    apis: ['./src/routes/*.js'],
  };
  