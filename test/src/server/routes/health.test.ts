import request from "supertest";
import app from "../../../../src/server/config";

describe("/_health endpoint", () => {
  it("should return 200", done => {
    request(app)
      .get("/_health")
      .expect(200)
      .send()
      .end((err, res) => {
        expect(res.status).toBe(200);
        return done();
      });
  });
});
