import app from "./app.js";
import db from "./config/db.js";

const Port = 3002;
app.listen(Port, async () => {
  await db.connect((err) => {
    if (err) {
      console.log("Error while connecting to database", err);
    } else {
      console.log("Database connected to MySQL successfully....");
      console.log(`Server is listening on port:${Port}`);
    }
  });
});
