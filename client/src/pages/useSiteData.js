import { useEffect, useState } from 'react';
import { api } from '../api';

export default function useSiteData() {
  const [data, setData] = useState({ loading: true });

  useEffect(() => {
    api('/api/site/resumo')
      .then((response) => setData({ ...response, loading: false }))
      .catch((error) => setData({ loading: false, error: error.message }));
  }, []);

  return data;
}
