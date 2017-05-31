<h1>Contributing to SceneVR</h1>

SceneVR is open source software. Knight Lab appreciates contributions to the code and to the translations that support publishing timelines in other languages.

Please be aware that SceneVR is designed to make VR storytelling simple. Historically, we've chosen not to pursue certain features which **could** be added to SceneVR because we felt that they diverged from our design principles. If you have ambitious ideas for changes, you should start a conversation about the idea in [GitHub issues](https://github.com/NUKnightLab/SceneVR/issues) using the "feature proposal" label. 

Translations, bug fixes and features proposed and endorsed by Knight Lab should be contributed as [GitHub pull requests](https://help.github.com/articles/using-pull-requests/).

If you run into challenges trying to set up for contribution, post a [GitHub issue](https://github.com/NUKnightLab/SceneVR/issues).

<h2>Working with the Code</h2>

The official way that SceneVR code is managed uses Node.js and npm.

To use this template, your computer needs:

- [NodeJS](https://nodejs.org/en/) (0.12 or greater)

Install dependencies by running this command from the project directory:
```bash
npm install
```

Once the requirements are installed, here are things to know:

* ALWAYS edit code in the [/src/](https://github.com/NUKnightLab/SceneVR/tree/master/src) directory. Pull requests which only have changes to code in the `/dist/` directory are incorrect and will not be accepted.
* use the `npm run start` command to compile your changes.
  * the compiled HTML, CSS, and JS will be in the `/dist/` directory
  * this command will also run a local web server for testing. The URL for the product page is http://localhost:8080/ and the URL for the embed is http://localhost:8080/scene.html
