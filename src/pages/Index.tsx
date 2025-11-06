import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Calendar className="w-24 h-24 text-primary" />
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/calendar')} className="gap-2">
            <Calendar className="w-5 h-5" />
            View Calendar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
