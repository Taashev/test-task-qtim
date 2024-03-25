const whiteList = ['http://localhost:3000', 'http://localhost:3001'];

export const corsConfig = {
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type'],
  origin: whiteList,
};
