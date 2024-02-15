import { app, BrowserWindow, ipcMain, Menu } from "electron";
import IsDev from "electron-is-dev";
import { getOptions, handleGetOptions, handleSetOptions } from "./api/options";
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
  handleRunNodeConsole,
} from "./api/node";
import { handleResizeInternalConsole, handleRunNodeInternalConsole, handleWriteInternalConsole } from "./api/console";
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

export let mainWindow: BrowserWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 900,
    width: 1400,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // set prod menu
  if (!IsDev) {
    const template = [
      {
        label: "Fichier",
        submenu: [
          {
            label: "Quitter",
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

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  ipcMain.handle("server:isConnected", handleIsConnected);
  ipcMain.handle("server:connect", handleConnect);
  ipcMain.handle("client:getOptions", handleGetOptions);
  ipcMain.handle("client:setOptions", handleSetOptions);
  ipcMain.handle("server:openProject", handleOpenProject);
  ipcMain.handle("server:createProject", handleCreateProject);
  ipcMain.handle("server:saveProject", handleSaveProject);
  ipcMain.handle("server:connectProject", handleConnectProject);
  ipcMain.handle("server:listProjects", handleListProjects);
  ipcMain.handle("server:getProjectState", handleGetProjectState);
  ipcMain.handle("server:readTopology", handleReadTopologyFile);
  ipcMain.handle("server:writeTopology", handleWriteTopologyFile);
  ipcMain.handle("server:checkTopology", handleCheckTopologyFile);
  ipcMain.handle("server:runTopology", handleRunTopology);
  ipcMain.handle("server:reloadTopology", handleReloadTopology);
  ipcMain.handle("server:readNodeConfigFiles", handleReadNodeConfigFiles);
  ipcMain.handle("server:runNodeConsole", handleRunNodeConsole);
  ipcMain.handle("server:runNodeStart", handleNodeStart);
  ipcMain.handle("server:runNodeStop", handleNodeStop);
  ipcMain.handle("server:runNodeRestart", handleNodeRestart);
  ipcMain.handle("server:runNodeCapture", handleNodeCapture);
  ipcMain.handle("server:runNodeSetIfState", handleNodeSetIfState);
  ipcMain.handle("server:close", handleCloseProject);
  // internal console
  ipcMain.handle("console:run", handleRunNodeInternalConsole);
  ipcMain.handle("console:write", handleWriteInternalConsole);
  ipcMain.handle("console:resize", handleResizeInternalConsole);

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
