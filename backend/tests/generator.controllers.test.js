jest.mock("../src/modules/blackbox/blackbox.service", () => ({
  generate: jest.fn(),
  generateScript: jest.fn(),
}));

jest.mock("../src/modules/whitebox/whitebox.service", () => ({
  analyze: jest.fn(),
  script: jest.fn(),
}));

const bbService = require("../src/modules/blackbox/blackbox.service");
const wbService = require("../src/modules/whitebox/whitebox.service");
const bbController = require("../src/modules/blackbox/blackbox.controller");
const wbController = require("../src/modules/whitebox/whitebox.controller");

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("Generator controllers", () => {
  it("blackbox generate should return success", async () => {
    const mockOutput = { mode: "blackbox", content: {}, requirement: "test requirement" };
    bbService.generate.mockResolvedValue(mockOutput);
    const req = { 
      user: { id: "u1" }, 
      body: { 
        method: "BVA", 
        requirement: "test requirement",
        conversationId: "conv-1"
      } 
    };
    const res = mockRes();
    await bbController.generate(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockOutput
    });
  });

  it("whitebox analyze should return success", async () => {
    const mockOutput = { mode: "whitebox", content: {}, logicCode: "if(true){}", uiCode: "<div></div>" };
    wbService.analyze.mockResolvedValue(mockOutput);
    const req = { 
      user: { id: "u1" }, 
      body: { 
        coverageType: "BRANCH", 
        sourceCode: "if(true){}",
        uiCode: "<div></div>"
      } 
    };
    const res = mockRes();
    await wbController.analyze(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockOutput
    });
  });
});
