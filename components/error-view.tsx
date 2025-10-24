import { AlertTriangle } from "lucide-react";

interface ErrorViewProps {
  message: string;
  description?: string;
  showIcon?: boolean;
}

export function ErrorView({
  message,
  description,
  showIcon = true,
}: ErrorViewProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white p-6">
      <div className="text-center max-w-md w-full">
        {showIcon && (
          <div className="flex justify-center mb-6">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
        )}
        <h1 className="text-3xl font-bold text-red-600 mb-4">{message}</h1>
        {description && (
          <p className="text-gray-600 text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
