export const config = {
  port: Number(process.env.PORT) || 3001,
  host: process.env.HOST || '0.0.0.0',
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/webvic3'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'webvic3-super-secret-key-change-in-production'
  }
}
