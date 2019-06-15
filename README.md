# Requirements

-   You need an android emulator while developing, use geny-motion.
-   Preferred editor is Visual Studio Code. Install Prettier - Code formatter plugin.
- Add following to workspace settings for auto-formatting on saving file.

```
{
    "editor.formatOnSave": true
}
```

# Setting up the project

In the project directory, run the following

-   `npm install -g expo-cli`
-   `mkdir project` and `cd project\`
-   `yarn install`
-   Make sure you've an emulator (geny-motion) or a device connected for testing
-   `expo start` 
-   Click on `Run on Android device/emulator` from the expo dashboard on your browser. Or press 'a' from the terminal.

# Creating PRs

For every issue assigned, you should create a branch of the of the name `I{issue_number}-some_name`.

Also provide the issue number in the commit as `#{issue_number} some description` i.e

`#23 fixed this and that`

Once you're ready, you should raise a PR & add peers to review.

# Typescript

We use typescript moving forward, to familarize yourself with typescript,

https://basarat.gitbooks.io/typescript/content/docs/getting-started.html

# FAQs
**Q:** How do I install Genymotion?

**A:** Go to the [Genymotion website](https://www.genymotion.com/fun-zone/) and download Genymotion with VirtualBox. Follow the installation procedure and create a new virtual device.

**Q:** How do I edit the workspace settings?

**A:** Go to the '.vscode' folder and add the entries to the 'settings.json' file.
