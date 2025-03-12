import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  useGetWalletTransactionQuery, 
  useSendWithdrawRequestMutation,
  useGetBalanceQuery,
  useCreateDepositPaymentMutation,
  useProcessDepositMutation
} from '@/redux/api/walletApi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';

const TRANSACTION_TYPES = [
  { 
    value: 'WithdrawRequestUser', 
    label: 'Withdraw Requests',
    description: 'Show withdraw requests by user'
  },
  { 
    value: 'WithdrawUser', 
    label: 'Withdrawals',
    description: 'Show withdrawals by user'
  },
  { 
    value: 'WithdrawRejectUser', 
    label: 'Rejected Withdrawals',
    description: 'Show rejected withdrawals by user'
  },
  { 
    value: 'ShowWithdrawHistoryUser', 
    label: 'Withdrawal History',
    description: 'Show all withdrawal transactions (including deposit, done/pending/fail withdraw)'
  },
  { 
    value: 'Deposit', 
    label: 'Deposits',
    description: 'Show deposit transactions'
  },
  { 
    value: 'ShowAllHistoryUser', 
    label: 'All Transactions',
    description: 'Show all transaction history'
  }
];

const Wallet = () => {
  // States
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('ShowAllHistoryUser');

  // API Hooks
  const { data: transactions, isLoading: isLoadingTransactions } = useGetWalletTransactionQuery({
    pageIndex: page,
    pageSize: pageSize,
    transactionType: transactionType
  });
  const { data: balanceData } = useGetBalanceQuery();
  const [createDepositPayment] = useCreateDepositPaymentMutation();
  const [processDeposit] = useProcessDepositMutation();
  const [sendWithdrawRequest, { isLoading: isWithdrawLoading }] = useSendWithdrawRequestMutation();

  // Handlers
  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      const result = await createDepositPayment({
        amount: Number(depositAmount),
        paymentMethod: 'Vnpay'
      }).unwrap();
      
      if (result.url) {
        window.location.href = result.url;
        setIsDepositModalOpen(false);
        setDepositAmount('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create deposit payment",
        variant: "destructive"
      });
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      const result = await sendWithdrawRequest({
        amount: Number(withdrawAmount)
      }).unwrap();
      
      toast({
        title: "Success",
        description: "Withdrawal request sent successfully",
      });
      setIsWithdrawModalOpen(false);
      setWithdrawAmount('');
    } catch (error) {
      const errorMessage = error?.data?.messages?.Error?.[0] || 
                          error?.data?.messages?.[0] ||
                          error?.data?.title ||
                          "Failed to send withdrawal request";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000
      });
    }
  };

  const handleTransactionTypeChange = (value) => {
    setTransactionType(value);
    setPage(1);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss');
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (isLoadingTransactions) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Wallet</h2>
        <div className="text-2xl font-bold">
          Balance: {formatAmount(balanceData?.data || 0)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <Button onClick={() => setIsDepositModalOpen(true)}>
          Deposit
        </Button>
        <Button onClick={() => setIsWithdrawModalOpen(true)} variant="outline">
          Withdraw
        </Button>
      </div>

      {/* Add Transaction Type Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="w-72">
            <Select value={transactionType} onValueChange={handleTransactionTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_TYPES.map((type) => (
                  <SelectItem 
                    key={type.value} 
                    value={type.value}
                  >
                    <div className="flex flex-col">
                      <span>{type.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {type.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-border">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Reference ID</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.data?.items.map((transaction) => (
              <tr key={transaction.id} className="border-b border-border hover:bg-muted/50">
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    transaction.type === 'Deposit' ? 'bg-blue-100 text-blue-800' :
                    transaction.type === 'Withdraw' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={transaction.type === 'Withdraw' ? 'text-red-600' : 'text-green-600'}>
                    {transaction.type === 'Withdraw' ? '- ' : '+ '}
                    {formatAmount(transaction.amount)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    transaction.status === 'Done' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    transaction.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-4 py-3">{formatDate(transaction.createdDate)}</td>
                <td className="px-4 py-3">
                  {transaction.referenceId || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {transactions?.data?.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <Button 
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={!transactions.data.hasPrevious}
          >
            Previous
          </Button>
          <span>
            Page {page} of {transactions.data.totalPages}
          </span>
          <Button 
            onClick={() => setPage(prev => prev + 1)}
            disabled={!transactions.data.hasNext}
          >
            Next
          </Button>
        </div>
      )}

      {/* Deposit Modal */}
      <Dialog open={isDepositModalOpen} onOpenChange={setIsDepositModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit to Wallet</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleDeposit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="amount">Amount (VND)</label>
                <Input
                  id="amount"
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="0"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDepositModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Proceed to Payment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Withdraw Modal */}
      <Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw from Wallet</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleWithdraw}>
            <div className="grid gap-4 py-4">
              <div className="text-sm text-muted-foreground">
                Current Balance: {formatAmount(balanceData?.data || 0)}
              </div>
              <div className="grid gap-2">
                <label htmlFor="withdrawAmount">Amount (VND)</label>
                <Input
                  id="withdrawAmount"
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="0"
                  max={balanceData?.data || 0}
                  required
                  disabled={isWithdrawLoading}
                />
                {Number(withdrawAmount) > (balanceData?.data || 0) && (
                  <p className="text-sm text-destructive">
                    Amount cannot exceed your current balance
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsWithdrawModalOpen(false)}
                disabled={isWithdrawLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={
                  isWithdrawLoading || 
                  Number(withdrawAmount) > (balanceData?.data || 0) ||
                  Number(withdrawAmount) <= 0
                }
              >
                {isWithdrawLoading ? "Processing..." : "Request Withdrawal"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wallet;