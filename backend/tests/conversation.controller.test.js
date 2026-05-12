jest.mock("../src/modules/conversation/conversation.service", () => ({
  getConversations: jest.fn(),
  createConversation: jest.fn(),
}));

const service = require("../src/modules/conversation/conversation.service");
const controller = require("../src/modules/conversation/conversation.controller");

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("Conversation controller", () => {
  it("list should return success", async () => {
    service.getConversations.mockResolvedValue([]);
    const req = { user: { id: "u1" } };
    const res = mockRes();

    await controller.list(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
