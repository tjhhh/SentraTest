jest.mock("../src/modules/blackbox/blackbox.service", () => ({
  getHistory: jest.fn(),
}));

const service = require("../src/modules/blackbox/blackbox.service");
const controller = require("../src/modules/blackbox/blackbox.controller");

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("Blackbox controller", () => {
  describe("history", () => {
    it("should return 200 and data when history exists", async () => {
      const mockData = { id: "tc1", payload: { req: "test" } };
      service.getHistory.mockResolvedValue(mockData);
      
      const req = { params: { conversationId: "conv1" } };
      const res = mockRes();
      const next = jest.fn();

      await controller.history(req, res, next);
      
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockData,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 404 when history not found", async () => {
      service.getHistory.mockResolvedValue(null);
      
      const req = { params: { conversationId: "conv1" } };
      const res = mockRes();
      const next = jest.fn();

      await controller.history(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: { message: "History not found" },
      });
    });

    it("should call next with error on service failure", async () => {
      const error = new Error("DB Error");
      service.getHistory.mockRejectedValue(error);
      
      const req = { params: { conversationId: "conv1" } };
      const res = mockRes();
      const next = jest.fn();

      await controller.history(req, res, next);
      
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
