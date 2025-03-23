import { useState, useEffect } from 'react';
import { stellarService } from '@/services/stellar.service';
import { walletService } from '@/services/wallet.service';
import { IContract } from '@/app/interface/contracts/contract.interface';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface CreateProjectFormProps {
  adminWallet: string;
}

export const CreateProjectForm = ({ adminWallet }: CreateProjectFormProps) => {
  const [formData, setFormData] = useState({
    project_id: '',
    creator: adminWallet,
    goal: 0,
    deadline: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const connected = walletService.isConnected();
    setIsConnected(connected);
  };

  const handleConnect = async () => {
    try {
      const publicKey = await walletService.connect();
      setIsConnected(true);
      setFormData(prev => ({ ...prev, creator: publicKey }));
    } catch (err) {
      setError('Error al conectar la billetera');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setError('Por favor, conecte su billetera primero');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const contractClient = await stellarService.buildClient<IContract>(formData.creator);
      
      const xdr = await contractClient?.create_project({
        project_id: formData.project_id,
        creator: formData.creator,
        goal: formData.goal,
        deadline: formData.deadline
      })).toXDR();

      const signedTx = await walletService.signTransaction(xdr);
      const hashId = await stellarService.submitTransaction(signedTx.signedTxXdr);
      
      console.log('Proyecto creado con hash:', hashId);
      alert('Proyecto creado exitosamente!');
    } catch (err) {
      setError('Error al crear el proyecto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'goal' || name === 'deadline' ? Number(value) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!isConnected ? (
        <Button
          type="button"
          onClick={handleConnect}
          className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
        >
          Conectar Billetera
        </Button>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="project_id" className="text-white">ID del Proyecto</Label>
            <Input
              id="project_id"
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              placeholder="Ingrese el ID del proyecto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal" className="text-white">Meta (en lumens)</Label>
            <Input
              type="number"
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              required
              min="0"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              placeholder="Ingrese la meta de financiamiento"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-white">Fecha Límite (timestamp)</Label>
            <Input
              type="number"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              min="0"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              placeholder="Ingrese la fecha límite"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
          >
            {loading ? 'Creando...' : 'Crear Proyecto'}
          </Button>
        </>
      )}
    </form>
  );
}; 