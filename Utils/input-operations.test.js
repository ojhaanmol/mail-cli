const readline = require('readline');
const prompt = require('./input-operations'); // Import the function to test

jest.mock('readline'); // Mock the readline module

describe('prompt function', () => {
    let rlMock;

    beforeEach(() => {
        // Create a mock implementation for readline.createInterface
        rlMock = {
            question: jest.fn(),
            close: jest.fn()
        };
        readline.createInterface = jest.fn(() => rlMock);

        // Mock console.clear to avoid side effects during tests
        console.clear = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should prompt the user with a question and resolve the input', async () => {
        const userInput = 'Test Input';
        rlMock.question.mockImplementation((query, callback) => {
            expect(query).toBe('Enter your name: '); // Verify question
            callback(userInput); // Simulate user input
        });

        const result = await prompt({ question: 'Enter your name: ' });
        expect(result).toBe(userInput); // Verify the resolved value
        expect(rlMock.close).toHaveBeenCalled(); // Ensure readline is closed
    });

    it('should clear the console if clear option is true', async () => {
        const userInput = 'Clear Test';
        rlMock.question.mockImplementation((query, callback) => {
            callback(userInput); // Simulate user input
        });

        const result = await prompt({ question: 'Clear screen?', clear: true });
        expect(result).toBe(userInput); // Verify input
        expect(console.clear).toHaveBeenCalled(); // Verify console.clear was called
    });

    it('should not clear the console if clear option is false', async () => {
        const userInput = 'No Clear Test';
        rlMock.question.mockImplementation((query, callback) => {
            callback(userInput); // Simulate user input
        });

        const result = await prompt({ question: 'Do not clear screen', clear: false });
        expect(result).toBe(userInput); // Verify input
        expect(console.clear).not.toHaveBeenCalled(); // Ensure console.clear was not called
    });
});
