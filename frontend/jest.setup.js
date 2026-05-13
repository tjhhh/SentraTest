import '@testing-library/jest-dom';

// Setup fetch mock for global test environment
global.fetch = jest.fn();

// Setup scrollTo mock (jsdom doesn't implement this)
Element.prototype.scrollTo = jest.fn();
