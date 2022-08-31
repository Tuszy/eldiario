Mardown Cheatsheet: https://www.markdownguide.org/basic-syntax/

Project Setup for DApp:
----------------------
1. Install NodeJS from https://nodejs.org/en/ - on Mac using homebrew (<code>brew install node</code>)
2. Install VS Code from https://code.visualstudio.com/download - on Mac using homebrew (<code>brew install --cask visual-studio-code</code>)
    - Install the **code** command in path - on Mac: *command+shift+p* and search for 'shell command'
    - Recommended VS Code extensions for this project:
        - https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one
        - https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense
        - https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint
        - https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
        - https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
        - https://marketplace.visualstudio.com/items?itemName=antfu.vite
        - https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets
        - https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag
        - https://marketplace.visualstudio.com/items?itemName=steoates.autoimport
        - https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag
        - https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost
        - https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer
        - https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight
    - Optional VS Code extensions for any project:
        - https://marketplace.visualstudio.com/items?itemName=antfu.browse-lite
        - https://marketplace.visualstudio.com/items?itemName=humao.rest-client
        - https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client
        - https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools
        - https://marketplace.visualstudio.com/items?itemName=adpyke.vscode-sql-formatter
        - https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme
        - https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight
        - https://marketplace.visualstudio.com/items?itemName=NomicFoundation.hardhat-solidity
        - https://marketplace.visualstudio.com/items?itemName=adpyke.codesnap
3. Install SourceTree from https://www.sourcetreeapp.com/ - on Mac using homebrew (https://formulae.brew.sh/cask/sourcetree)
4. Create a GitHub Project, generate ssh keys and login using SourceTree (Mac specific zsh setup: https://apple.stackexchange.com/questions/48502/how-can-i-permanently-add-my-ssh-private-key-to-keychain-so-it-is-automatically)
5. Create Vite project with <code>npm create vite@latest</code> and choose the ***react-ts*** template
6. Install eslint with <code>npm i -D eslint</code> and initialize the eslint config file **.eslintrc.json** for ***react-ts*** with <code>npx eslint --init</code>
7. Add the following to VS Code's **settings.json** - on Mac: *command+shift+p* and search for 'settings json':
    
        {
            "editor.codeActionsOnSave": {
                "source.fixAll.eslint": true
            },
            "eslint.validate": ["javascript"]
        }

8. Add *jsdom* and *testing library* for **React**: <code>npm i -D jsdom @testing-library/react</code>
9. Install vitest with <code>npm i -D vitest</code> and adapt the **vite.config.ts** file to contain this:
   
        import "vite";
        import "vitest";

        // react with vitest
        // https://www.eternaldev.com/blog/testing-a-react-application-with-vitest/

        import react from "@vitejs/plugin-react";
        import { defineConfig } from "vite";

        // https://vitejs.dev/config/
        export default defineConfig({
            plugins: [react()],
            test: {
                globals: true,
                environment: "jsdom",
            }
        });


10. Add *vitest* test script to **package.json**

        "scripts": {
            "dev": "vite",
            "build": "tsc && vite build",
            "preview": "vite preview",
            "test": "vitest" // <-- this
        }

11. Add **react-router-dom** and **@types/react-router-dom** dependencies:
    1. <code>npm i react-router-dom</code> 
    2. <code>npm i -D @types/react-router-dom</code>

12. Import and use *BrowserRouter* in **main.tsx**:

        import React from "react";
        import ReactDOM from "react-dom/client";
        import { BrowserRouter } from "react-router-dom";
        import App from "./App";

        ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
            <React.StrictMode>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </React.StrictMode>
        );
13. Add ethers dependency
    1.  <code>npm i ethers</code>
14.  Add **@mui/material**, **@mui/types**, **@emotion/react**, **@emotion/styled** and **@mui/icons-material** dependencies:
     1. <code>npm i @mui/material @emotion/react @emotion/styled @mui/icons-material</code>  
     2. <code>npm i -D @mui/types</code>
15. Follow Material UI instructions on https://mui.com/material-ui/getting-started/installation/
    1.  Link to *Roboto* font **index.html**

            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>
    
    2.  Link to *Material* icons in **index.html**

            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>

    3. Import and use *CssBaseline* in **main.tsx** to reset the **CSS** (https://mui.com/material-ui/api/css-baseline/#main-content):

            import React from "react";
            import ReactDOM from "react-dom/client";
            import { BrowserRouter } from "react-router-dom";
            import CssBaseline from "@mui/material/CssBaseline";
            import App from "./App";

            ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
                <React.StrictMode>
                    <BrowserRouter>
                        <CssBaseline enableColorScheme />
                        <App />
                    </BrowserRouter>
                </React.StrictMode>
            );

16. Add *Theme* file **theme.js** (Theming: https://mui.com/material-ui/customization/theming/)

        import { createTheme } from "@mui/material/styles";

        const theme = createTheme({
            palette: {
                primary: {
                    main: "#0052cc",
                },
                secondary: {
                    main: "#edf2ff",
                },
            }
        });

        export default theme;

17. Import and use *ThemeProvider* in **main.tsx**

        import React from "react";
        import ReactDOM from "react-dom/client";

        import { BrowserRouter } from "react-router-dom";

        import CssBaseline from "@mui/material/CssBaseline";
        import { ThemeProvider } from "@mui/material/styles";
        import theme from "./theme";

        import App from "./App";

        ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
            <React.StrictMode>
                <BrowserRouter>
                    <ThemeProvider theme={theme}>
                        <CssBaseline enableColorScheme />
                        <App />
                    </ThemeProvider>
                </BrowserRouter>
            </React.StrictMode>
        );
