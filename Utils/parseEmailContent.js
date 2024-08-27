const parseEmailContent = (fileContent) => {
    const lines = fileContent.split('\n').map(line => line.trim());

    const greetingKeywords = ['hii', 'hello', 'dear'];
    const footerKeywords = ['thank you', 'regards', 'sincerely', 'best regards'];

    const subject = lines.find( line => line )
    const subject_index = lines.indexOf( subject );

    const greet_body_footer = lines.slice( subject_index+1 );
    let greet = greet_body_footer.find( line => line )
    const greet_index = greet_body_footer.indexOf( greet );

    if(! greet.split(' ').find( keyword => greetingKeywords.includes(keyword.toLowerCase()) ))
    greet = 'Dear';

    const body_footer = greet_body_footer.slice( greet_index +1 );
    const footer_start = body_footer.find( line => footerKeywords.includes( line.toLowerCase().split(',').join('') ) );
    const footer_start_index = body_footer.indexOf( footer_start );

    const body = body_footer.slice( 0,footer_start_index+2 ).join('\n');
    const footer = body_footer.slice( footer_start_index+1 ).join('\n');

    const emailParts = {
        subject,
        greet,
        body,
        footer
    };

    return emailParts;
};

module.exports = parseEmailContent;
