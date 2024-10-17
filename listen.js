const app = require('./app');
const { PORT = 5858 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));