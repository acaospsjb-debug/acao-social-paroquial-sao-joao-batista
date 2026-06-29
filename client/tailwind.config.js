export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        asp: {
          /* Azul-claro: cor institucional principal */
          sky: '#e8f4fd',
          'sky-mid': '#bde0f7',
          blue: '#2079a8',
          'blue-dark': '#165f82',
          /* Verde: ações positivas, impacto */
          green: '#1e9b62',
          'green-light': '#d4f0e4',
          /* Amarelo: esperança, destaque */
          warm: '#ffca28',
          'warm-dark': '#f0b400',
          yellow: '#fff9e0',
          /* Coral: pequenos destaques */
          coral: '#e8602c',
          'coral-light': '#fff0ec',
          /* Neutros claros */
          ink: '#2d3a4a',
          muted: '#5c6a7a',
          soft: '#f4f9fe',
          paper: '#ffffff',
          border: '#cde0ef'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif']
      },
      boxShadow: {
        soft: '0 4px 24px rgba(32, 121, 168, 0.10)',
        card: '0 2px 12px rgba(32, 121, 168, 0.08)',
        cta: '0 8px 32px rgba(32, 121, 168, 0.22)'
      }
    }
  },
  plugins: []
};
