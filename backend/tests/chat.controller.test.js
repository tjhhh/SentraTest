jest.mock("../src/modules/chat/chat.service", () => ({
  chat: jest.fn(),
  getChatHistory: jest.fn(),
  streamChat: jest.fn(),
}));

const service = require("../src/modules/chat/chat.service");
const controller = require("../src/modules/chat/chat.controller");

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn(),
    end: jest.fn(),
  };
}

describe("Chat controller", () => {
  it("history should return success", async () => {
    service.getChatHistory.mockResolvedValue([]);
    const req = { user: { id: "u1" } };
    const res = mockRes();
    await controller.getHistory(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
