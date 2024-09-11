import { Command } from '@tauri-apps/api/shell'

export const dirOpen = async (path) => {
  const open = new Command('open-explorer', [path])
  return await open.execute()
}