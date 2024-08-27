const readline = require('readline');

const prompt = ({question="",clear=false}) => {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(question, (answer) => {
            rl.close();
            clear && console.clear();
            return resolve(answer);
        });
    })
}
module.exports = prompt