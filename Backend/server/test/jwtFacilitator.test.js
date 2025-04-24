const jwtManager = require("../managers/jwtManagers");
const auth = require("../middleware/auth");
const dotenv = require("dotenv");
dotenv.config();

describe("jwtManager", () => {
  it("should generate a valid JWT token", () => {
    const payload = { id: "123", name: "John Doe" };
    const token = jwtManager(payload);

    expect(typeof token).toBe("string");
    expect(token).toBeDefined();
    expect(token.length).toBeGreaterThan(0);
  });
});
