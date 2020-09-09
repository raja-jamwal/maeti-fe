# Requirements

-   You need an android emulator while developing, use geny-motion.
-   Preferred editor is Visual Studio Code. Install Prettier - Code formatter plugin.
-   Add following to workspace settings for auto-formatting on saving file.

```
{
    "editor.formatOnSave": true
}
```

# Setting up the project

In the project directory, run the following

-   `npm install -g expo-cli yarn` (install expo-cli & yarn)
-   `git clone git@github.com:linuxexp/matrimonial-fe.git`
-   Install android-sdk or (android-studio) if you don't already have. Make sure you're able to run `adb` on console.
-   `yarn install`
-   Make sure you've an emulator (geny-motion) or a device connected for testing
-   `expo start`
-   Click on `Run on Android device/emulator` from the expo dashboard on your browser. Or press 'a' from the terminal.

# Setting up android prerequisite

-   Download android-studio or android-sdk
-   Set up the environment variable i.e `$ANDROID_HOME`

On `bash` based terminals, this can be set by adding `android-sdk` path to `~/.bash_profile`.
For example if sdk path is `/Users/home/Library/Android/sdk`

```
export ANDROID_HOME=/Users/home/Library/Android/sdk
export PATH=$ANDROID_HOME/tools:$PATH
export PATH=$ANDROID_HOME/platform-tools:$PATH
```

-   Point geny-motion to use `android-sdk's` `adb` ![geny_motion_adb_pref](./docs/images/genymotion_adb_pref.png)

-   Install Android phone image, recommended is `Google Nexus 7` API level `22 (5.1v)`

![android_image](./docs/images/android_image.png)

-   If everything is properly configured you should see geny-motion device listed from `adb` in console.

![adb_devices](./docs/images/adb_devices.png)

# Finding sdk path if you've installed Android-studio

From your android studio preference you'll find the `android sdk` location

![android sdk path android studio](./docs/images/android_home.png)

# Creating PRs

For every issue assigned, you should create a branch of the of the name `PR-{issue_number}-some_name`.

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

# Issue with adb

Make sure you've android-sdk installed in your system.

You could run into multiple `adb` issues,

-   The `adb` server version is different than `adb` client version.

The root cause for this is, you might have multiple android-sdks installed (expo/android studio) and they have different adb versions in them.

What you need to do is

1. Agree on to use either android-studio/expo android-sdk, find the path to it let's call it `/Users/home/Library/Android/sdk`.
2. Need to make sure `adb` binary under this path is accessible from the `PATH`. On bash based terminals, this can be done by updating `~/.bash_profile`

```bash
export ANDROID_HOME=/Users/home/Library/Android/sdk
export PATH=$ANDROID_HOME/tools:$PATH
export PATH=$ANDROID_HOME/platform-tools:$PATH
```

_Add steps for updating window's environment variables_

3. Point Genymotion, `adb` path to `/Users/home/Library/Android/sdk`.
4. Now that expo (from PATH) and geneymotion are using same adb, it should work.

# FCM server key

Keeping note here

```
AIzaSyD8Ef7mfMg9kynLcNLR-LWM2KKdVYCOTLY
```

```
expo push:android:upload --api-key <your-token-here>
```

## Expo upgrade

-   use node 12 - `sudo n 12.0.0.1`
-   use latest expo-cli `sudo npm -g npm` and `sudo npm -g expo-cli`
-   reinstall modules `yarn install`

## Uploading to store

-   Update `android version code` in app.json under `expo.android.versionCode`
-   `expo build:android -t app-bundle`

## With release channel

-   `expo build:android -t app-bundle --release-channel staging`
-   `expo build:android -t app-bundle --release-channel prod`

-   `expo build:ios --release-channel staging`

## Publish JS updates

-   `expo publish --release-channel <staging|prod>`

## ADB logcat

-   `adb logcat *:S ReactNative:V ReactNativeJS:V`
