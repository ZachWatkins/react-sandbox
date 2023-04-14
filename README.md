# react-sandbox

Empty project.

## Building and running on localhost

First install dependencies:

```sh
yarn install
```

To run in hot module reloading mode:

```sh
npm start
```

To create a production build:

```sh
npm run build-prod
```

To create a development build:

```sh
npm run build-dev
```

## Running

Open the file `dist/index.html` in your browser

## Testing

To run unit tests:

```sh
npm test
```

## Dev Containers

### Sharing Git credentials between Windows and WSL

Source: https://code.visualstudio.com/docs/remote/troubleshooting#_sharing-git-credentials-between-windows-and-wsl

If you use HTTPS to clone your repositories and have a credential helper configured in Windows, you can share this with WSL so that passwords you enter are persisted on both sides. (Note that this does not apply to using SSH keys.)

Just follow these steps:

1. Configure the credential manager on Windows by running the following in a Windows command prompt or PowerShell:

   `git config --global credential.helper wincred`  

2. Configure WSL to use the same credential helper, but running the following in a WSL terminal:

   `git config --global credential.helper "/mnt/c/Program\ Files/Git/mingw64/bin/git-credential-manager-core.exe"`
