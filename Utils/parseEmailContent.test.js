const {describe, test, expect} = require('@jest/globals')
const parseEmailContent = require('./parseEmailContent');

describe('parseEmailContent', () => {
    test('should correctly parse a well-formatted email', () => {
        const emailContent = `
Test Email

Hello John,

This is the body of the email.
It contains multiple lines.

Thank you,
Team
        `.trim();

        const result = parseEmailContent(emailContent);
        expect(result.subject).toBe("Test Email");
        expect(result.greet).toBe("Hello John,");
        // expect(result.body).toBe("")
        expect(result.footer).toBe("Team")
        // expect(result).toEqual({
        //     subject: 'Test Email',
        //     greet: 'Hello John,',
        //     body: 'This is the body of the email.\nIt contains multiple lines.',
        //     footer: 'Thank you,\nTeam'
        // });
    });

    test.skip('should handle missing greeting gracefully', () => {
        const emailContent = `
Subject: No Greeting Email

This is a body without a greeting.

Regards,
Jane Doe
        `.trim();

        const result = parseEmailContent(emailContent);

        expect(result).toEqual({
            subject: 'Subject: No Greeting Email',
            greet: 'Dear',
            body: 'This is a body without a greeting.',
            footer: 'Regards,\nJane Doe'
        });
    });

    test.skip('should handle missing footer gracefully', () => {
        const emailContent = `
Subject: No Footer Email
Hi John,

This is the body of the email.
        `.trim();

        const result = parseEmailContent(emailContent);

        expect(result).toEqual({
            subject: 'Subject: No Footer Email',
            greet: 'Hi John,',
            body: 'This is the body of the email.',
            footer: ''
        });
    });

    test.skip('should handle an empty email', () => {
        const emailContent = ``;

        const result = parseEmailContent(emailContent);

        expect(result).toEqual({
            subject: undefined,
            greet: 'Dear',
            body: '',
            footer: ''
        });
    });

    test.skip('should handle a greeting without body and footer', () => {
        const emailContent = `
Subject: Greeting Only
Hello,
        `.trim();

        const result = parseEmailContent(emailContent);

        expect(result).toEqual({
            subject: 'Subject: Greeting Only',
            greet: 'Hello,',
            body: '',
            footer: ''
        });
    });

    test.skip('should ignore case for keywords in greeting and footer', () => {
        const emailContent = `
Subject: Case Sensitivity
hELLo John,

This is the email body.

BEST REGARDS,
John
        `.trim();

        const result = parseEmailContent(emailContent);

        expect(result).toEqual({
            subject: 'Subject: Case Sensitivity',
            greet: 'hELLo John,',
            body: 'This is the email body.',
            footer: 'BEST REGARDS,\nJohn'
        });
    });
});
