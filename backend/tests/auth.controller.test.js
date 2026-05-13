jest.mock("../src/modules/auth/auth.service", () => ({
  register: jest.fn(),
  login: jest.fn(),
  refresh: jest.fn(),
  logout: jest.fn(),
}));

const authService = require("../src/modules/auth/auth.service");
const controller = require("../src/modules/auth/auth.controller");

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("Auth controller", () => {
  it("register should return 201", async () => {
    authService.register.mockResolvedValue({ user: { id: "u1" } });
    const req = { body: { email: "a@b.com", password: "12345678" } };
    const res = mockRes();
    const next = jest.fn();

    await controller.register(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(next).not.toHaveBeenCalled();
  });
});
