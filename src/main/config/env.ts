export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://root:root@localhost:27017/lojao-back-end?authSource=admin',
  port: process.env.PORT ?? 5050,
  jwtSecret: process.env.JWT_SCRET ?? 'tj532==5h'
}
