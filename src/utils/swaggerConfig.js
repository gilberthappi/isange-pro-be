// swaggerConfig.js
export const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'ISANGE PRO API',
        version: '1.0.0',
        description: 'Isange Pro  API Documentation',
      },
      servers: [
        {
          url: 'https://isange-pro-be.onrender.com/api/v1',
        },
        {
          url: 'http://localhost:2000/api/v1',
        },


        
      ],
      
    },
    apis: ['./src/routes/*.js'],
  };
  