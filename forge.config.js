module.exports = {
    packagerConfig: {
        icon: "icon/gonetem-ui.icns"
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "gonetem-ui"
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
            config: {}
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