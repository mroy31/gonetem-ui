import { app, BrowserWindow, ipcMain, Menu } from "electron";
import IsDev from "electron-is-dev";
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

export let mainWindow: BrowserWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
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

  mainWindow.on('close', () => {
    setAppWinBounds(mainWindow.getBounds());
  });

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
  ipcMain.handle("server:recordTopologyImg", handleRecordTopologyImg);
  ipcMain.handle("server:runAllConsoles", handleRunAllConsoles);
  ipcMain.handle("server:readNodeConfigFiles", handleReadNodeConfigFiles);
  ipcMain.handle("server:runNodeConsole", handleRunNodeConsole);
  ipcMain.handle("server:runNodeStart", handleNodeStart);
  ipcMain.handle("server:runNodeStop", handleNodeStop);
  ipcMain.handle("server:runNodeRestart", handleNodeRestart);
  ipcMain.handle("server:runNodeCapture", handleNodeCapture);
  ipcMain.handle("server:runNodeSetIfState", handleNodeSetIfState);
  ipcMain.handle("server:close", handleCloseProject);
  ipcMain.handle("server:pullImages", handlePullImages);
  // internal console
  ipcMain.handle("console:run", handleRunNodeInternalConsole);
  ipcMain.handle("console:write", handleWriteInternalConsole);
  ipcMain.handle("console:resize", handleResizeInternalConsole);
  ipcMain.handle("console:listOpen", handleListOpenConsoles);
  ipcMain.handle("console:saveState", handleSaveConsoleState);
  // i18n
  ipcMain.handle("i18n:read", handleI18nRead);
  ipcMain.handle("i18n:write", handleI18nCreate);

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
