import 'material-design-icons-iconfont/dist/material-design-icons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

const theme = {
  primary: '#E91E63',
  secondary: '#9C27b0',
  accent: '#e91e63',
  info: '#00CAE3',
  success: '#4CAF50',
  warning: '#FB8C00',
  error: '#FF5252',
};

export default new Vuetify({
  icons: {
    iconfont: 'md',
  },
  theme: {
    themes: {
      dark: theme,
      light: theme,
    },
  },
});
