import * as fs from "node:fs";
import * as path from "node:path";
import * as process from "node:process";
import swaggerTSApi from "swagger-typescript-api";
const { generateApi } = swaggerTSApi;

const outputDir = path.resolve(process.cwd(), "./src/types");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
generateApi({
  url: `${process.env.NEXT_PUBLIC_SWAGGER_DOMAIN}api/schema/`,
  output: outputDir,
  httpClientType: "axios",
  generateUnionEnums: true,
  generateRouteTypes: true,
  generateClient: true,
  generateRouteTypes: true,
  generateResponses: true,
  name: "api",
})
  .then(() => {
    console.log("API types generated successfully!");
  })
  .catch((error) => {
    console.error("Error generating API types:", error);
  });
