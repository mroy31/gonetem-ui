import "./app-edition-identity";
import { app, BrowserWindow, ipcMain, Menu } from "electron";
import IsDev from "electron-is-dev";
import {initMainI18n} from "./i18n/main";
import { getAppState, getOptions, handleGetOptions, handleSetOptions, setAppWinBounds } from "./api/options";
import { connectToServer, handleConnect, handleIsConnected } from "./api/client";
import {
  handleCloseProject,
  handleConnectProject,
  handleCreateProject,
  handleGetProjectState,
  handleListProjects,
  handleOpenProject,
  handleSaveProject,
} from "./api/project";
import {
  handleCheckTopologyFile,
  handleReadTopologyFile,
  handleRecordTopologyImg,
  handleReloadTopology,
  handleRunTopology,
  handleWriteTopologyFile,
} from "./api/topology";
import {
  handleNodeCapture,
  handleNodeRestart,
  handleNodeSetIfState,
  handleNodeStart,
  handleNodeStop,
  handleReadNodeConfigFiles,
  handleRunAllConsoles,
  handleRunNodeConsole,
} from "./api/node";
import { handleListOpenConsoles, handleResizeInternalConsole, handleRunNodeInternalConsole, handleSaveConsoleState, handleWriteInternalConsole } from "./api/console";
import { handlePullImages } from "./api/server";
import { handleI18nRead, handleI18nCreate } from "./api/i18n";
import { registerIpcHandlers, IpcHandlers } from "./ipc";
import { t } from "i18next";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

export let mainWindow: BrowserWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  initMainI18n().then(() => {
    const appState = getAppState();

    // Create the browser window.
    mainWindow = new BrowserWindow({
      icon: "../icon/gonetem-ui_512x512.png",
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    });
    mainWindow.setBounds(appState.winBounds);

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // set prod menu
    if (!IsDev) {
      const template = [
        {
          label: t("File"),
          submenu: [
            {
              label: t("Quit"),
              click: () => {
                app.quit();
              },
            },
          ],
        },
      ];
      mainWindow.once("ready-to-show", () => {
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
        mainWindow.show();
      });
    }

    mainWindow.on('close', () => {
      setAppWinBounds(mainWindow.getBounds());
    });

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  const handlers: IpcHandlers = {
    "server:isConnected": handleIsConnected,
    "server:connect": handleConnect,
    "client:getOptions": handleGetOptions,
    "client:setOptions": handleSetOptions,
    "server:openProject": handleOpenProject,
    "server:createProject": handleCreateProject,
    "server:saveProject": handleSaveProject,
    "server:connectProject": handleConnectProject,
    "server:listProjects": handleListProjects,
    "server:getProjectState": handleGetProjectState,
    "server:readTopology": handleReadTopologyFile,
    "server:writeTopology": handleWriteTopologyFile,
    "server:checkTopology": handleCheckTopologyFile,
    "server:runTopology": handleRunTopology,
    "server:reloadTopology": handleReloadTopology,
    "server:recordTopologyImg": handleRecordTopologyImg,
    "server:runAllConsoles": handleRunAllConsoles,
    "server:readNodeConfigFiles": handleReadNodeConfigFiles,
    "server:runNodeConsole": handleRunNodeConsole,
    "server:runNodeStart": handleNodeStart,
    "server:runNodeStop": handleNodeStop,
    "server:runNodeRestart": handleNodeRestart,
    "server:runNodeCapture": handleNodeCapture,
    "server:runNodeSetIfState": handleNodeSetIfState,
    "server:close": handleCloseProject,
    "server:pullImages": handlePullImages,
    // internal console
    "console:run": handleRunNodeInternalConsole,
    "console:write": handleWriteInternalConsole,
    "console:resize": handleResizeInternalConsole,
    "console:listOpen": handleListOpenConsoles,
    "console:saveState": handleSaveConsoleState,
    // i18n
    "i18n:read": handleI18nRead,
    "i18n:write": handleI18nCreate,
  };

  registerIpcHandlers(ipcMain, handlers);

  const options = getOptions();
  if (options.autoconnect && options.server != "") {
    connectToServer().then((res) => {
      if (!res.status)
        console.log(`Unable to connect to server ${options.server}: ${res.error}`);
      createWindow();
    });
  } else {
    createWindow();
  } 

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
