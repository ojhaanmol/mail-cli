const { spawn } = require('child_process');
const openEditor = require('./openEditor'); // Import the function to test

jest.mock('child_process'); // Mock child_process module

describe('openEditor function', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it('should resolve when the editor process exits successfully', async () => {
        const mockOn = jest.fn((event, callback) => {
            if (event === 'exit') callback(0); // Simulate successful exit
        });
        spawn.mockReturnValue({ on: mockOn }); // Mock spawn behavior

        const result = await openEditor({ editor: 'nano', file: 'test.txt' });
        expect(result).toBe('file writin successfull.'); // Ensure the success message
        expect(spawn).toHaveBeenCalledWith('nano', ['test.txt'], { stdio: 'inherit' });
    });

    it('should reject if the editor process exits with a non-zero code', async () => {
        const mockOn = jest.fn((event, callback) => {
            if (event === 'exit') callback(1); // Simulate error exit
        });
        spawn.mockReturnValue({ on: mockOn }); // Mock spawn behavior

        await expect(openEditor({ editor: 'nano', file: 'test.txt' })).rejects.toThrow(
            'Editor process exited with code 1'
        );
        expect(spawn).toHaveBeenCalledWith('nano', ['test.txt'], { stdio: 'inherit' });
    });

    it('should throw an error for unknown editors', () => {
        expect(() =>
            openEditor({ editor: 'unknown-editor', file: 'test.txt' })
        ).toThrow('unknown editor unknown-editor.\nDefault editor nano');
    });

    it('should use default editor nano if editor is not provided', async () => {
        const mockOn = jest.fn((event, callback) => {
            if (event === 'exit') callback(0); // Simulate successful exit
        });
        spawn.mockReturnValue({ on: mockOn }); // Mock spawn behavior

        const result = await openEditor({ file: 'test.txt' }); // No editor provided
        expect(result).toBe('file writin successfull.');
        expect(spawn).toHaveBeenCalledWith('nano', ['test.txt'], { stdio: 'inherit' });
    });
});
