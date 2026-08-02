import React from 'react';
import { X, Github, Cloud, Flame, CheckCircle, ExternalLink, Copy } from 'lucide-react';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal text-slate-100 rounded-[32px] border border-white/20 max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto text-xs sm:text-sm">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 glass-dark text-amber-400 rounded-2xl border border-white/10">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-amber-300">
                Guia de Publicação (Git + Vercel + Firebase Free)
              </h2>
              <p className="text-xs text-emerald-300/80">
                Como publicar este Micro SaaS na nuvem em menos de 5 minutos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Step 1: GitHub */}
          <div className="glass-dark p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center space-x-2 text-amber-300 font-extrabold text-sm">
              <Github className="w-4 h-4 text-amber-400" />
              <span>1. Subir o Código no Git / GitHub</span>
            </div>
            <p className="text-slate-300 text-xs">
              Exporte os arquivos ou baixe o repositório e rode no seu terminal:
            </p>
            <div className="glass p-3 rounded-xl border border-white/10 font-mono text-[11px] text-emerald-300 relative group">
              <code>
                git init<br />
                git add .<br />
                git commit -m "Publicação Sinuca SaaS"<br />
                git branch -M main<br />
                git remote add origin https://github.com/seu-usuario/sinuca-saas.git<br />
                git push -u origin main
              </code>
              <button
                onClick={() =>
                  copyToClipboard(
                    'git init\ngit add .\ngit commit -m "Publicação Sinuca SaaS"\ngit branch -M main\ngit push -u origin main'
                  )
                }
                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white"
                title="Copiar comandos"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Step 2: Vercel Hosting */}
          <div className="glass-dark p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center space-x-2 text-amber-300 font-extrabold text-sm">
              <ExternalLink className="w-4 h-4 text-amber-400" />
              <span>2. Hospedagem Gratuita na Vercel</span>
            </div>
            <p className="text-slate-300 text-xs">
              Este projeto já contém o arquivo <code className="text-amber-300 font-mono">vercel.json</code> pronto para rotas de Single Page Application.
            </p>
            <ol className="list-disc list-inside space-y-1 text-slate-300 text-xs pl-2">
              <li>Acesse <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-amber-300 underline font-semibold">vercel.com</a> e faça login com sua conta GitHub.</li>
              <li>Clique em <strong>"Add New Project"</strong> e selecione o repositório do Sinuca SaaS.</li>
              <li>O Framework Preset detectará automaticamente <strong>Vite</strong>. Clique em <strong>Deploy</strong>!</li>
            </ol>
          </div>

          {/* Step 3: Firebase Config (Free Spark Plan) */}
          <div className="glass-dark p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center space-x-2 text-amber-300 font-extrabold text-sm">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>3. Conectar Banco de Dados Google Firebase (Plano Free Spark)</span>
            </div>
            <p className="text-slate-300 text-xs">
              O aplicativo funciona 100% offline via LocalStorage, mas se você quiser sincronização na nuvem para vários celulares ao mesmo tempo:
            </p>
            <ol className="list-disc list-inside space-y-1 text-slate-300 text-xs pl-2">
              <li>Acesse <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-amber-300 underline font-semibold">console.firebase.google.com</a> no plano gratuito.</li>
              <li>Crie um projeto e adicione uma aplicação Web.</li>
              <li>Crie um banco de dados **Firestore** no modo Teste.</li>
              <li>Na Vercel (Environment Variables), adicione as variáveis contidas no arquivo <code className="text-amber-300 font-mono">.env.example</code>:</li>
            </ol>
            <div className="glass p-2.5 rounded-xl border border-white/10 font-mono text-[10px] text-amber-200">
              VITE_FIREBASE_API_KEY="..."<br />
              VITE_FIREBASE_AUTH_DOMAIN="..."<br />
              VITE_FIREBASE_PROJECT_ID="..."<br />
              VITE_FIREBASE_STORAGE_BUCKET="..."<br />
              VITE_FIREBASE_MESSAGING_SENDER_ID="..."<br />
              VITE_FIREBASE_APP_ID="..."
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-2.5 rounded-xl uppercase text-xs shadow-lg border border-emerald-300/50"
          >
            Entendido, Excelente!
          </button>
        </div>
      </div>
    </div>
  );
};
