import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const ryderTheme = {
  dark: false,
  colors: {
    background: '#F6F7FB',
    surface: '#FFFFFF',
    primary: '#C8102E',
    secondary: '#0050B5',
    accent: '#F2C94C',
    info: '#1B4F9B',
    success: '#2E7D32',
    warning: '#B76A00',
    error: '#C62828',
  },
}

export default createVuetify({
  theme: {
    defaultTheme: 'ryder',
    themes: {
      ryder: ryderTheme,
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})
