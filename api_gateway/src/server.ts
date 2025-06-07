import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import routes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔥 Skip express.json for /auth to avoid conflict with proxy
app.use((req, res, next) => {
  if (req.url.startsWith("/auth")) {
    next(); // don't use bodyParser
  } else {
    express.json()(req, res, next); // use bodyParser for non-proxy routes
  }
});

// Swagger
const swaggerDocument = YAML.load("swagger.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
