import 'server-only'
import { readSettings } from './store'
import { DEFAULT_SETTINGS, normalizeSettings, type SiteSettings } from './settings-shared'

export async function getSettings(): Promise<SiteSettings> {
  try {
    return normalizeSettings(await readSettings())
  } catch (error) {
    console.error('[reverie] failed to load settings', error)
    return DEFAULT_SETTINGS
  }
}
