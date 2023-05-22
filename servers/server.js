import app from "./app.js";

const server = app.listen(process.env.PORT, () => {
  console.log(
    "Server started at: " + new Date() + ` Port: ${process.env.PORT}`
  );
});
