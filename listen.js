const app = require('./app');
const { port = 5858 } = process.env;

app.listen(port, () => console.log("Listening on 5858"));