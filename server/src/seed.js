const { createSchema } = require('./schema');
const { ensureInitialData } = require('./initialData');
require('dotenv').config();

async function seed() {
  await createSchema();
  await ensureInitialData();
  console.log('Banco criado e seed executado com sucesso.');
}

seed().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
