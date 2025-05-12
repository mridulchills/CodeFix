
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'destructive';
  isLoading?: boolean;
  className?: string;
}

const FeatureButton = ({ 
  icon: Icon, 
  label, 
  onClick, 
  variant = 'default',
  isLoading = false,
  className 
}: FeatureButtonProps) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={isLoading}
      className={cn("flex items-center gap-2", className)}
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Icon className="h-4 w-4" />
      )}
      <span>{label}</span>
    </Button>
  );
};

export default FeatureButton;
