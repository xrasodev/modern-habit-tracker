import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-200 p-4 font-sans">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="p-4 bg-indigo-500/10 rounded-full">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
        <p className="text-lg font-medium text-slate-400">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
