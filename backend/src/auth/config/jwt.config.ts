import { registerAs } from "@nestjs/config";

export default registerAs("jwt", () => {
  return {
    secret: process.env.JWT_SECRET,
    accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL ?? "86400", 10),
  };
});
