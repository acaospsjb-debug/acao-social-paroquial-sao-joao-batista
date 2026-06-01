export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        asp: {
          green: '#4f8f7b',
          blue: '#5e9ab8',
          warm: '#d9824b',
          ink: '#243235',
          soft: '#f3f8f6'
        }
      },
      boxShadow: {
        soft: '0 18px 45px rgba(36, 50, 53, 0.10)'
      }
    }
  },
  plugins: []
};
