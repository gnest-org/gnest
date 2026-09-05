import Server from "./src/app";

(async () => {
  const app = await Server();
  app.listen(3000, () => {
    logging.info('-----------------------------------------');
    logging.info('Server started: localhost:' + 3000);
    logging.info('-----------------------------------------');
  });
})();
