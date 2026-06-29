export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        asp: {
          green: '#238768',
          blue: '#4c9ccf',
          warm: '#e86f45',
          yellow: '#f4c84f',
          ink: '#203436',
          soft: '#eefaf3'
        }
      },
      boxShadow: {
        soft: '0 18px 45px rgba(32, 52, 54, 0.12)'
      }
    }
  },
  plugins: []
};
