const app = require('./src');

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log('server is running at port ' + PORT);
});
