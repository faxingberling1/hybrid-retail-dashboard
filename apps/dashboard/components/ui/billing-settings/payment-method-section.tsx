import { CreditCard as CardIcon, Wallet } from 'lucide-react';

interface PaymentMethod {
  method: string;
  type: string;
  lastFour: string;
  expiryDate: string;
}

interface PaymentMethodSectionProps {
  paymentMethod: PaymentMethod;
  onChangePaymentMethod: () => void;
}

export default function PaymentMethodSection({ 
  paymentMethod, 
  onChangePaymentMethod 
}: PaymentMethodSectionProps) {
  const getCardIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'visa': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'mastercard': return 'bg-gradient-to-r from-red-500 to-yellow-500';
      case 'amex': return 'bg-gradient-to-r from-green-500 to-blue-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`h-10 w-16 ${getCardIcon(paymentMethod.type)} rounded-lg flex items-center justify-center mr-4`}>
              <CardIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{paymentMethod.method}</div>
              <div className="text-sm text-gray-600">Expires {paymentMethod.expiryDate}</div>
            </div>
          </div>
          <button
            onClick={onChangePaymentMethod}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Change
          </button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wallet className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Backup payment methods</span>
            </div>
            <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
              Add Backup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}