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
            name: "@electron-forge/plugin-vite",
            config: {
                build: [
                    {
                        entry: "src/index.ts",
                        config: "vite.main.config.mts",
                        target: "main"
                    },
                    {
                        entry: "src/preload.ts",
                        config: "vite.preload.config.mts",
                        target: "preload"
                    }
                ],
                renderer: [
                    {
                        name: "main_window",
                        config: "vite.renderer.config.mts"
                    }
                ]
            }
        }
    ]
}