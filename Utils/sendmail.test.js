const nodemailer = require('nodemailer');
const send_mail = require('./sendmail'); // Import the function to test

jest.mock('nodemailer'); // Mock nodemailer module

describe('send_mail', () => {
    let mockTransporter;

    beforeEach(() => {
        // Mock nodemailer.createTransport
        mockTransporter = {
            sendMail: jest.fn()
        };
        nodemailer.createTransport = jest.fn(() => mockTransporter);
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    test('should send an email successfully with correct inputs', async () => {
        const mockInfo = { messageId: '12345' };
        mockTransporter.sendMail.mockResolvedValue(mockInfo); // Mock successful send

        const emailData = {
            host: 'smtp.example.com',
            port: 587,
            secure: false,
            user: 'user@example.com',
            pass: 'password',
            from: 'user@example.com',
            to: 'recipient@example.com',
            subject: 'Test Email',
            text: 'This is a test email.',
            html: '<p>This is a test email.</p>',
        };

        const result = await send_mail(emailData);

        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            host: 'smtp.example.com',
            port: 587,
            secure: false,
            auth: {
                user: 'user@example.com',
                pass: 'password'
            }
        });
        expect(mockTransporter.sendMail).toHaveBeenCalledWith({
            from: 'user@example.com',
            to: 'recipient@example.com',
            subject: 'Test Email',
            text: 'This is a test email.',
            html: '<p>This is a test email.</p>',
        });
        expect(result).toEqual(mockInfo);
    });

    test('should handle errors when email sending fails', async () => {
        const mockError = new Error('Failed to send email');
        mockTransporter.sendMail.mockRejectedValue(mockError); // Mock failure

        const emailData = {
            host: 'smtp.example.com',
            port: 587,
            secure: false,
            user: 'user@example.com',
            pass: 'password',
            from: 'user@example.com',
            to: 'recipient@example.com',
            subject: 'Test Email',
            text: 'This is a test email.',
            html: '<p>This is a test email.</p>',
        };

        await expect(send_mail(emailData)).rejects.toThrow('Failed to send email');

        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            host: 'smtp.example.com',
            port: 587,
            secure: false,
            auth: {
                user: 'user@example.com',
                pass: 'password'
            }
        });
        expect(mockTransporter.sendMail).toHaveBeenCalledWith({
            from: 'user@example.com',
            to: 'recipient@example.com',
            subject: 'Test Email',
            text: 'This is a test email.',
            html: '<p>This is a test email.</p>',
        });
    });

    test.skip('should handle missing required fields gracefully', async () => {
        const emailData = {
            host: 'smtp.example.com',
            port: 587,
            secure: false,
            user: 'user@example.com',
            pass: 'password',
            from: '',
            to: 'recipient@example.com',
            subject: 'Test Email',
            text: 'This is a test email.',
            html: '<p>This is a test email.</p>',
        };

        await expect(send_mail(emailData)).rejects.toThrow();
        expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });
});
