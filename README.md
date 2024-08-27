# Mail CLI Tool

A command-line interface (CLI) tool for managing email drafts, configuring SMTP settings, and sending emails.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
  - [Setup Commands](#setup-commands)
  - [Draft Commands](#draft-commands)
- [Configuration](#configuration)
- [Draft Management](#draft)
- [App Password](#app-password)
  - [Zoho](#zoho)
  - [Google](#gmail)
- [License](#license)

## Installation

To use this CLI tool, you must have Node.js installed. Clone the repository and install the dependencies.

```bash
git clone https://github.com/your-repo/mail-cli-tool.git
cd mail-cli-tool
npm install
```

## Usage

Run the CLI tool using the following command:

```bash
node index.js <command> [options]
```

### Setup Commands

Configure the tool with your email settings and editor preferences.

```bash
node index.js --setup --smtp-host <host>
node index.js --setup --smtp-port <port>
node index.js --setup --auth-user <username>
node index.js --setup --auth-pass <password>
node index.js --setup --set-secure
node index.js --setup --set-unsecure
node index.js --setup --set-editor <editor>
node index.js --setup --view-config
node index.js --setup --edit-config

```

### Draft Commands

Manage your email drafts with the following commands:

```bash
node index.js --draft --new [--tag <tagname>]
node index.js --draft --get-draft-list
node index.js --draft --get-draft <draft_id or tag_name>
node index.js --draft --edit-draft --subject <draft_id or tag_name> <new_subject>
node index.js --draft --edit-draft --body <draft_id or tag_name> <new_body>
node index.js --draft --send [<draft_id or tag_name>]

```

## Configuration

The configuration is stored in a config.json file. You can set up the following properties:

- **smtp-host**: SMTP server host.
- **smtp-port**: SMTP server port.
- **set-secure**: Boolean indicating if the connection should use SSL.
- **auth-user**: SMTP username.
- **auth-pass**: SMTP password.
- **editor-set**: Default editor for editing drafts.

## Draft

Drafts are stored in the VOLUMES/Drafts/ directory, and their metadata is maintained in the VOLUMES/drafts.json file. You can create, edit, and send drafts using the commands provided in the [Draft Commands](#draft-commands) section.

## App Password

### Zoho

- Use the following url in your browser
  ```
  https://accounts.zoho.in/home#profile/personal
  ```
- Go to **Account** Section in top left corner, and go to **Security** and **select Password** 

  ![Alt Account>Security>Password](./public/select-security.png)

- Go to App Specific Password Section, and select **"Generate New Password"**

  ![Alt App_Specific_Password](./public/app_specific_pass.png)

- Give a new App name, and select **Generate** to create a new Application

![Alt App_Specific_Password](./public/generate_app_password.png)

- A new **password** will be generated for the user

### Gmail

- **Open your Google Account** :
  and go to **search Bar**.

  ![google search bar](./public/google-search-bar.png)

- **Search for App Passwords.**
  
  ![Search for App Passwords in search bar](./public/SearchTemplate.png)

- **create a new App Password**

  ![create a new App Passwords by giving name to your app.](./public/AppPasswords.png)

## License

This project is licensed under the MIT License

```vbnet

### Notes:
- The structure of the `README.md` is designed to guide users through installing and using the CLI tool.
- The sections cover how to configure the SMTP settings, manage drafts, and access help within the tool.
- You should replace the placeholder repository URL in the installation instructions with the actual repository URL when deploying.

```