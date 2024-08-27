const { spawn } = require('child_process');
const assert = require('assert');

function openEditor({editor, file}) {
    assert(!editor || ['nano','vi','code'].includes(editor), `unknown editor ${editor}.\nDefault editor nano`)
    return new Promise((resolve, reject) => {
        const editorProcess = spawn(editor, [file], { stdio: 'inherit' });

        editorProcess.on('exit', (code) => {
            if (code !== 0) 
                return reject(new Error(`Editor process exited with code ${code}`));
            return resolve('file writin successfull.')
        });
    })
}
module.exports = openEditor