const { ensureInitialData } = require('./initialData');
require('./env');
const { connectMongo } = require('./mongo');

async function seed() {
  await connectMongo();
  await ensureInitialData();
  console.log('Seed do MongoDB executado com sucesso.');
}

seed().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
