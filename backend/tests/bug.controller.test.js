jest.mock("../src/modules/bug/bug.service", () => ({
  explain: jest.fn(),
}));

const service = require("../src/modules/bug/bug.service");
const controller = require("../src/modules/bug/bug.controller");

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("Bug controller", () => {
  it("explain should return success", async () => {
    service.explain.mockResolvedValue({});
    const req = { user: { id: "u1" }, body: { stackTrace: "Error: x" } };
    const res = mockRes();
    await controller.explain(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
