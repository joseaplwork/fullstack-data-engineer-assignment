export const isDevelopment = process.env.NODE_ENV !== 'production';
export const mongoUri = process.env.MONGODB_URI!;

export const getDatabaseName = () => {
  return isDevelopment ? 'tomorrow-university-dev' : 'tomorrow-university-prod';
};