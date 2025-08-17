import { FunctionComponent } from 'preact';

const LoadingSpinner: FunctionComponent = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95"
      role="status"
      aria-live="polite"
      aria-label="Cargando la lista de Venezuela Juega"
    >
      <div className="flex flex-col items-center text-center px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight md:leading-snug pb-1 overflow-visible bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-blue-300 to-red-300">
          Venezuela Juega
        </h1>

        <div
          className="mt-5 md:mt-6 h-1 w-24 rounded-full bg-cyan-400/70 motion-reduce:animate-none animate-pulse"
          aria-hidden="true"
        />

        <p className="mt-6 text-base md:text-lg text-cyan-400 bg-slate-800/50 px-4 py-2 rounded-full">
          La lista de videojuegos está cargando...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;