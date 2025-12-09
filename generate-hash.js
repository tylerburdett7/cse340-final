import bcrypt from 'bcrypt';

(async () => {
  const hash = await bcrypt.hash('password123', 10);
  console.log('Bcrypt hash for password123:');
  console.log(hash);
})();
