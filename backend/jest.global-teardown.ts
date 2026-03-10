export default async function globalTeardown() {
  process.env.NODE_ENV ??= 'development';
  process.env.PORT ??= '4000';
  process.env.API_KEY ??= 'test-api-key';

  const { shutdownPostgres, removeAllShiftRequests } = await import('./src/dataSources/postgres');
  try {
    await removeAllShiftRequests();
  } finally {
    await shutdownPostgres();
  }
}
