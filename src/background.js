'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog, globalShortcut } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import jsonfile from 'jsonfile'
import Store from 'electron-store'
const isDevelopment = process.env.NODE_ENV !== 'production'

Store.initRenderer()

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    }
  })

  console.log(`production: ${process.env.NODE_ENV}`)
  if(!isDevelopment) {
    win.setMenuBarVisibility(false)
  }

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  ipcMain.on('saveSettings', (e, { name, settings}) => {
    dialog.showSaveDialog(win, {
      title: 'Save Current WaveSim Settings',
        defaultPath: name != null ? name : undefined,
        filters: [
          { name: 'Wave Simulator Settings', extensions: ['json'] }
        ]
      }
    ).then(({canceled, filePath}) => {
      if (canceled || filePath === undefined) {
        e.reply('saveSettingsComplete', {
          success: false,
          name: null,
        })
        return
      }
      jsonfile.writeFile(filePath, settings, { spaces: 2 }, (err) => {
        if (err) {
          dialog.showErrorBox(`failed to save file`, `couldn't save ${filePath}`)
        e.reply('saveSettingsComplete', {
          success: false,
          name: filePath,
        })
          return
        }
      })
      e.reply('saveSettingsComplete', {
        success: true,
        name: filePath,
      })
    })
  })

  ipcMain.on('openSettings', (e) => {
    dialog.showOpenDialog(win, {
      title: 'Open WaveSim Settings',
      filters: [
        { name: 'Wave Simulator Settings', extensions: ['json'] }
      ]
    }).then(({filePaths}) => {
      if (filePaths.length === 0) {
        e.reply('openSettingsComplete', {
          success: false,
          name: null,
          settings: null,
        })
        return
      }

      jsonfile.readFile(filePaths[0], (err, json) => {
        if (err) {
          dialog.showErrorBox(`failed to open file`, `couldn't open ${filePaths[0]}`)
          e.reply('openSettingsComplete', {
            success: false,
            name: filePaths[0],
            settings: null,
          })
          return
        }

        if (json.simRandomData === undefined) {
          dialog.showErrorBox(`invalid project file`, `${filePaths[0]} is not a valid Macron WaveSim Settings file`)
          e.reply('openSettingsComplete', {
            success: false,
            name: filePaths[0],
            settings: null,
          })
          return
        }

        e.reply('openSettingsComplete', {
          success: true,
          name: filePaths[0],
          settings: json,
        })
      })
    })
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  globalShortcut.register("CommandOrControl+R", () => {
    // ignore
  })

  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}