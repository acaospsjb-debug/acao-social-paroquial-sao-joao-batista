import { useOutletContext } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { whatsappLink } from '../api';

export default function Contato() {
  const { config } = useOutletContext();

  return (
    <main className="section">
      <SectionHeader eyebrow="Contato" title="Fale com a Ação Social Paroquial São João Batista">
        O principal canal de conversão deste MVP é o WhatsApp institucional.
      </SectionHeader>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl font-bold">Canais</h2>
          <p className="mt-4 text-slate-600">WhatsApp: {config?.whatsapp}</p>
          <p className="text-slate-600">E-mail: {config?.email}</p>
          <p className="text-slate-600">Endereço: {config?.endereco}</p>
          <a className="btn-primary mt-6" href={whatsappLink(config?.whatsapp)} target="_blank" rel="noreferrer">Falar com a ONG pelo WhatsApp</a>
        </div>
        <form className="card grid gap-4 p-6" onSubmit={(event) => event.preventDefault()}>
          <input className="rounded-md border p-3" placeholder="Nome" />
          <input className="rounded-md border p-3" placeholder="E-mail" />
          <input className="rounded-md border p-3" placeholder="Telefone" />
          <textarea className="min-h-32 rounded-md border p-3" placeholder="Mensagem" />
          <button className="btn-secondary" type="submit">Registrar interesse</button>
          <p className="text-sm text-slate-500">No MVP, este formulário não envia dados para serviços externos.</p>
        </form>
      </div>
    </main>
  );
}
