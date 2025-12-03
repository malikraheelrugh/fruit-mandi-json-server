const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Add custom routes before JSON Server router
server.get("/api/dashboard/stats", (req, res) => {
  const db = router.db;
  const suppliers = db.get("suppliers").value().length;
  const clients = db.get("clients").value().length;
  const transactions = db.get("transactions").value();
  const totalAmount = transactions.reduce((sum, t) => sum + t.totalAmount, 0);

  res.json({
    suppliers,
    clients,
    totalTransactions: transactions.length,
    totalAmount,
    recentTransactions: transactions.slice(-5),
  });
});

// Use default router
server.use("/api", router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
