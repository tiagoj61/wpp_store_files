<h1 align="center"> Automatically Save Receipts from WhatsApp</h1>
<p align="center">
<img src="http://img.shields.io/static/v1?label=STATUS&message=FINISHED&color=GREEN&style=for-the-badge"/>
</p>

<h4 align="center"> 
    :checkered_flag: Finished :checkered_flag:
</h4>

## Table of Content

* [📚 Description](#-description)
* [:hammer: How to Use](#hammer-how-to-use)
* [☄ Features](#-features)
* [✔️ Technologies Used](#%EF%B8%8F-technologies-used)
* [☔ Potential Issues](#-potential-issues)
* [📄 License](#-license)

## 📚 Description
<p>This project uses the <a href="https://github.com/wppconnect-team/wppconnect">wppconnect</a> library to automate tasks on WhatsApp. It fetches messages from a specific chat, verifies if they contain predefined keywords, and downloads related media files. The files are then organized into specific folders based on the current month and message caption.</p>

## :hammer: How to Use
<p>Follow the steps below to use this project:</p>

### 1. Configure Environment Variables

Make sure to set the following variables in the `.env` file:

- `LCL`: Indicates the current application environment.
- `id`: ID of the chat from which messages will be fetched.

### 2. Set Up Folder Structure

Ensure the following folder structure exists:

- `/home/pc/Documentos/Comprovantes/<keyword>`

Each keyword defined in the `keyMessages` variable needs a corresponding directory inside `Comprovantes`.

### 3. Install Dependencies

Make sure the following are installed:

- **Node.js** (latest recommended version).
- **npm** or **yarn** for managing packages.
- Library `@wppconnect-team/wppconnect`.
- Library `dotenv` for environment variables management.
- Library `fs-extra` for file handling.

Install dependencies with:

```bash
npm install
```

### 4. Run the Project

Start the application with the following command:

```bash
node app.js
```

During initialization, a QR code will be displayed in the terminal. Scan it using WhatsApp to authenticate.

## ☄ Features

- Connect to WhatsApp via **wppconnect**.
- Fetch messages from a specific chat.
- Identify messages based on predefined keywords.
- Download media attached to messages.
- Organize files into directories based on the month and caption.

## ✔️ Technologies Used

- ``Node.js``
- ``npm``
- ``@wppconnect-team/wppconnect``
- ``dotenv``
- ``fs-extra``

## ☔ Potential Issues

- **Message not found**: Mark the chat as unread before start the project.
- **Permission errors**: Ensure the user has write permissions for the specified directories.