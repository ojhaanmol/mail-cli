const { readFileSync, writeFileSync, readdirSync, mkdirSync } = require('fs');
const { parse: parse_markdown_to_html } = require('marked');
const parseEmailContent = require('./Utils/parseEmailContent');
const openEditor = require('./Utils/openEditor');
const send_mail = require('./Utils/sendmail');
const prompt = require('./Utils/input-operations');
const assert = require('assert');

const debug = true
/**
 * --setup
 *      --smtp-host
 *      --smtp-port
 *      --set-secure
 *      --auth-user
 *      --auth-pass
 *      --editor-set
 *      --view-config
 *      --edit-config
 *      --help (defalut)
 * --draft
 *      --new [optional --tag {tagname}]
 *          first prompt from
 *          then prompt to
 *          then open editor    
 *      --get-drafts <array of [draft-id, draft-tag]>
 *      --get-draft ""__[draft-id, draft-tag]
 *      --edit-draft 
 *          --subject ""__[draft-id, draft-tag]
 *          --body ""__[draft-id, draft-tag] <---------open default editor
 *      --send
 *      --help (defalut)
 * --help (defalut)
 * */

const config_file_path = './config.json';
!readdirSync('./').includes( 'config.json' ) && writeFileSync('./config.json',JSON.stringify({}))
const get_config = () => JSON.parse(readFileSync( config_file_path, {encoding:'utf-8'} ));
const commit_config = ( new_config ) => writeFileSync( config_file_path, JSON.stringify(new_config, null, 4) );

const drafts_path = './VOLUMES/Drafts/';
const drafts_info_path = './VOLUMES/drafts.json';
!readdirSync("./VOLUMES").includes("drafts.json")&&writeFileSync(drafts_info_path,JSON.stringify({drafts:[]}));
!readdirSync("./VOLUMES").includes("Drafts")&&mkdirSync(drafts_path);
const get_drafts_object = () => JSON.parse( readFileSync( drafts_info_path, {encoding:'utf-8'} ) ).drafts;
const commit_drafts = ( updated_drafts ) => writeFileSync( drafts_info_path, JSON.stringify( {drafts:updated_drafts}, null, 4 ) );

const create_new_draft_with_tag = async( tag_name ) => {
    assert( tag_name.length>=1 , 'usage: mail-cli --draft --new --tag <tag_name>');
    tag_name = tag_name[0];
    const from = await prompt({question:'from:  '});
    const to = await prompt({question:'to:  '});
    console.clear();
    const creation_time = new Date();
    const new_mail = {
        tag_name,
        creation_time: ''+creation_time,
        from,
        to,
        draft_status:'not sent',
        filename: +creation_time+'.txt'
    };
    const drafts = get_drafts_object();
    assert(!drafts.map( draft => draft["tag_name"] ).includes(tag_name), 'tag_name already exist')
    drafts.push(new_mail);
    commit_drafts( drafts );
    await openEditor({editor:get_config()["editor-set"],file:(drafts_path+(+creation_time)+'.txt')});
    console.log(`${+creation_time} ${new_mail.creation_time} ${new_mail.from}:${new_mail.to} ${new_mail.draft_status} ${new_mail.tag_name}`);
}
const create_new_draft = async() => {
    const from = await prompt({question:'from:  '});
    const to = await prompt({question:'to:  '});
    console.clear();
    const creation_time = new Date();
    const new_mail = {
        tag_name: +creation_time,
        creation_time: ''+creation_time,
        from,
        to,
        draft_status:'not sent',
        filename: +creation_time+'.txt'
    };
    const drafts = get_drafts_object();
    assert( !drafts.map( draft => draft["tag_name"] ).includes( new_mail.tag_name ),  'tag_name already exist')
    drafts.push(new_mail);
    commit_drafts( drafts );
    await openEditor({editor:get_config()["editor-set"] ,file:(drafts_path+(+creation_time)+'.txt') });
    console.log(`${+creation_time} ${new_mail.creation_time} ${new_mail.from}:${new_mail.to} ${new_mail.draft_status} ${new_mail.tag_name}`);
}
const get_existing_draft = ( draft_id ) => {
    assert( draft_id.length >= 1 , 'usage: mail-cli --draft --get-draft <draft_id>' );
    draft_id = draft_id[0];
    let draft_from_index = null;
    let draft_exist  =(readdirSync( drafts_path ).map( draft => draft.split('.')[0] ).includes( draft_id ));
    if(!draft_exist){
        draft_from_index = get_drafts_object().filter( draft => draft.tag_name === draft_id )[0];
        if(draft_from_index){
            draft_id = draft_from_index.filename.split('.')[0];
            draft_exist = true;
        }
    }
    assert( draft_exist , `draft with ${draft_id} not exist.`);
    const draft = readFileSync(drafts_path+draft_id+'.txt',{encoding:'utf8'});
    console.log(draft);
}
const get_drafts = () => {
    const drafts = get_drafts_object();
    console.log(drafts.map( draft => `${draft.filename.split('.')[0]} ${draft.creation_time.split(' ').slice(0,5).join('-')} ${draft.from}:${draft.to} ${draft.draft_status} ${draft.tag_name}` ).join('\n'));
}
const edit_draft_subject = ( params ) => {
    assert( params.length >= 2 , 'usage: mail-cli --draft --edit-draft --subject <draft_id> <subject>' );
    const draft_id = params[0];
    const subject = params[1];
    let draft_exist  =(readdirSync( drafts_path ).map( draft => draft.split('.')[0] ).includes( draft_id ));
    if(!draft_exist){
        draft_from_index = get_drafts_object().filter( draft => draft.tag_name === draft_id )[0];
        if(draft_from_index){
            draft_id = draft_from_index.filename.split('.')[0];
            draft_exist = true;
        }
    }
    const draft = readFileSync(drafts_path+draft_id+'.txt',{encoding:'utf8'});
    const new_draft = draft.split('\n').map( (line,index) => index === 0 ? subject : line  ).join('');
    writeFileSync( drafts_path+draft_id+'.txt', new_draft );
}
const edit_draft_body = ( params ) => {
    assert( params.length >= 2 , 'usage: mail-cli --draft --edit-draft --body <draft_id> <subject>' );
    const draft_id = params[0];
    const body = params.slice(1).join(' ');
    let draft_exist  =(readdirSync( drafts_path ).map( draft => draft.split('.')[0] ).includes( draft_id ));
    if(!draft_exist){
        draft_from_index = get_drafts_object().filter( draft => draft.tag_name === draft_id )[0];
        if(draft_from_index){
            draft_id = draft_from_index.filename.split('.')[0];
            draft_exist = true;
        }
    }
    const draft = readFileSync(drafts_path+draft_id+'.txt',{encoding:'utf8'});
    const new_draft = draft.split('\n')[0] + '\n\n' + body;
    writeFileSync( drafts_path+draft_id+'.txt', new_draft );
}
const edit_draft = async() => {
    let draft_id = await prompt({question:"draft_id/draft tag: "});
    let draft_from_index = null;
    let draft_exist  =(readdirSync( drafts_path ).map( draft => draft.split('.')[0] ).includes( draft_id ));
    if(!draft_exist){
        draft_from_index = get_drafts_object().filter( draft => draft.tag_name === draft_id )[0];
        if(draft_from_index){
            draft_id = draft_from_index.filename.split('.')[0];
            draft_exist = true;
        }
    }
    await openEditor({editor:'nano',file:drafts_path+draft_id+'.txt'})
}
const send_drafts = async(params)=>{
    let draft_id = null;
    if( params.length === 0 )
        draft_id = await prompt({question: "draft_id : ", clear:true});
    else
        draft_id = params[0]
    let draft_from_index = null;
    let draft_exist  =(readdirSync( drafts_path ).map( draft => draft.split('.')[0] ).includes( draft_id ));
    if(!draft_exist){
        draft_from_index = get_drafts_object().filter( draft => draft.tag_name === draft_id )[0];
        if(draft_from_index){
            draft_id = draft_from_index.filename.split('.')[0];
            draft_exist = true;
        }
    }
    assert( draft_exist , `draft with ${draft_id} not exist.`);
    
    const config = get_config();
    const details = get_drafts_object().filter( draft => draft.filename.split('.')[0] === draft_id)[0];
    const draft = ''+readFileSync( drafts_path+details.filename );
    const mail_template = ''+readFileSync( "./VOLUMES/mail.template.html" );
    const { subject, greet, body, footer } = parseEmailContent( draft );
    const {
        "smtp-host" : host,
        "smtp-port" : port,
        "set-secure": secure,
        "auth-pass" : pass,
        "auth-user" : user,
        "contact-phone" : phone,
        "contact-email" : email
    } = config;

    const populate = parse_markdown_to_html( body )

    const html = 
    mail_template
        .split('[:mail_subject]').join( subject )
        .split("[:mail_reciver_name]").join(greet)
        .split("[:populate]").join( populate )
        .split("[:mail_to_email]").join(email)
        .split("[:contact_phone]").join(phone);
    const arguments = {  ...details, host, port, secure, user, pass, subject, text: draft.split('\n').slice(1).join('\n'),html };
    const info = await send_mail(arguments);
    console.log(info);
}
const set_smtp_host = ( hostname ) => {
    assert( hostname.length>=1 , 'usage: mail-cli --setup --smtp-host <smtp_hostname>' );
    hostname=hostname[0];
    const configuration = get_config();
    commit_config({...configuration,"smtp-host":hostname});
}
const set_smtp_port = ( port ) => {
    assert( port.length>=1 , 'usage: mail-cli --setup --smtp-port <smtp_port>');
    port = port[0];
    assert( ""+(+port) !== 'NaN','port should be a number.');
    const configuration = get_config();
    commit_config({...configuration,"smtp-port":+port});
}
const set_secure = () => {
    const configuration = get_config();
    commit_config({...configuration,"set-secure":true});
}
const set_unsecure = () => {
    const configuration = get_config();
    commit_config({...configuration,"set-secure":false});
}
const set_auth_user = ( auth_user ) => {
    assert( auth_user.length>=1 , 'usage: mail-cli --setup --auth-user <user_auth>' );
    auth_user = auth_user[0]
    const configuration = get_config();
    commit_config({...configuration,"auth-user":auth_user})
}
const set_auth_pass = ( auth_pass ) => {
    assert( auth_pass.length>=1 , 'usage: mail-cli --setup --auth-pass <password>' );
    auth_pass=auth_pass[0];
    const configuration = get_config();
    commit_config({...configuration,"auth-pass":auth_pass})
}
const set_editor = ( editor ) => {
    assert( editor.length>=1 , 'usage: mail-cli --setup --set-editor <editor>' );
    editor=editor[0];
    const configuration = get_config();
    commit_config({...configuration,"editor-set":editor})
}
const view_config = () => {
    console.log(JSON.stringify( get_config(), null, 4 ));
}
const edit_Config = async() => {
    await openEditor( { editor: 'nano', file:config_file_path } );
}
const setup_config = () => {
    const setup_config_text = 
`
--------------------------
# Usage :
==========================
    --setup --smtp-host <host>
    --setup --smtp-port <port:number>
    --setup --auth-user <auth_username>
    --setup --auth-pass <auth_password>
    --setup --set-editor <editor defaults to nano>
    --setup --set-secure
    --setup --set-unsecure
    --setup --view-config
    --setup --edit-config
    --setup --help
`;
    console.log(setup_config_text);
}
const draft_help = () => {
    const draft_help_text = 
`
--------------------------
# Usage :
==========================
--draft
    --new
        --tag < tag_name >
    --get-draft-list,
    --get-draft
    --edit-draft
        --subject
        --body
    --send
    --help
`;
console.log(draft_help_text);
}
const mail_cli_help = () => {
    const mail_cli_help_text =
`
--------------------------
# Usage :
==========================
    --setup
        --smtp-host
        --smtp-port
        --set-secure
        --set-unsecure
        --auth-user
        --auth-pass
        --set-editor
        --view-config
        --edit-config
        --help
    --draft
        --new
            --tag
        --get-draft-list
        --get-draft
        --edit-draft
            --subject
            --body
        --send
        --help
    --help
`;
console.log(mail_cli_help_text);
}

const operation_mapping = {
    "--setup":{
        "--smtp-host"   :set_smtp_host,
        "--smtp-port"   :set_smtp_port,
        "--set-secure"  :set_secure,
        "--set-unsecure":set_unsecure,
        "--auth-user"   :set_auth_user,
        "--auth-pass"   :set_auth_pass,
        "--set-editor"  :set_editor,
        "--view-config" :view_config,
        "--edit-config" :edit_Config,
        "--help"        :setup_config,
        "default"       :setup_config
    },
    "--draft":{
        "--new":{
            "--tag"          :create_new_draft_with_tag,
            "default"        :create_new_draft
        },
        "--get-draft-list" :get_drafts,
        "--get-draft"      :get_existing_draft,
        "--edit-draft"     :{
            "--subject"      :edit_draft_subject,
            "--body"         :edit_draft_body,
            "default"        :edit_draft
        },
        "--send"           :send_drafts,
        "--help"           :draft_help,
        "default"          :draft_help
    },
    "default":mail_cli_help,
    "--help":mail_cli_help
}

const main = async() => {
    try {    
        const arguments = process.argv;
        let func = operation_mapping[ arguments[2] ];
        let index=2;

        for( index; index < arguments.length; index++){
            if( typeof func === 'object'&& typeof func[ arguments[index+1] ] === 'undefined'){
                func = func.default;
                break;
            }
            else if( typeof func === 'object' )
                func = func[ arguments[index+1] ];
            else if( typeof func === 'function' )
                break;
        }
        const functional_arguments = arguments.slice(index+1);
        if( typeof func === 'function' )
            await func(functional_arguments)
        if( !func )
            await operation_mapping['--help']()
    } catch (error) {
        console.error(error.message);
        debug && console.error(error)
    }
}
main();