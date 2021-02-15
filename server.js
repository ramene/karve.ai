const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const initializeDatabase = require('./db/initializeDatabase');
const port = process.env.PORT || '3000';

(async () => {
    await initializeDatabase();
})();

app.use(bodyParser.urlencoded({
    extended: true,
  }));

app.use(bodyParser.json());

// const options = {
//     inflate: true,
//     reviver: (key, value) => {
//       if (key === 'name') {
//         if (value == "Lachlan") {
//           return 'young'
//         }
//         else {
//           return 'old';
//         }
//       }
//       else {
//         return value;
//       }
//     }
//   };
// app.use(bodyParser.json(options));

app.post('/event', function (req, res) {
  var events = req.body;

  res.send("OK");

  console.log(events);
 
});

app.listen(port, () => {
    console.log(`Server ready at http://0.0.0.0:${port}`);
});