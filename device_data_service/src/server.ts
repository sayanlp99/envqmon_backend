import app from './app';

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`Data Service running at http://localhost:${PORT}`);
});
