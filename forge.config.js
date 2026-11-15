const { readEditionEnv } = require("./scripts/edition-env");

const { edition } = readEditionEnv();
const appName = edition === "student" ? "gonetem-ui-student" : "gonetem-ui";

module.exports = {
    packagerConfig: {
        name: appName,
        icon: "icon/gonetem-ui.icns",
        extraResource: [
            "./app",
        ]
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: appName
            }
        },
        {
            name: "@electron-forge/maker-zip",
            platforms: [
                "darwin"
            ]
        },
        {
            name: "@electron-forge/maker-deb",
            config: {
                options: {
                    name: appName,
                    icon: 'icon/gonetem-ui_512x512.png'
                }
            }
        }
    ],
    plugins: [
        {
            name: "@electron-forge/plugin-webpack",
            config: {
                mainConfig: "./webpack.main.config.js",
                renderer: {
                    config: "./webpack.renderer.config.js",
                    entryPoints: [
                        {
                            html: "./src/index.html",
                            js: "./src/renderer.ts",
                            name: "main_window",
                            preload: {
                                js: "./src/preload.ts"
                            }
                        }
                    ]
                }
            }
        }
    ]
}