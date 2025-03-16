import React, { useState } from 'react';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { 
  useGetWalletTransactionQuery, 
  useSendWithdrawRequestMutation,
  useGetBalanceQuery,
  useCreateDepositPaymentMutation,
  useProcessDepositMutation,
} from '@/redux/api/walletApi';



const Transactions = () => {
  // States
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [transactionType, setTransactionType] = useState('BookingPurchase');


  // API Hooks
  const { data: transactions, isLoading: isLoadingTransactions } = useGetWalletTransactionQuery({
    pageIndex: page,
    pageSize: pageSize,
    transactionType: transactionType
  });
  const { data: balanceData } = useGetBalanceQuery();
  const [createDepositPayment] = useCreateDepositPaymentMutation();


  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss');
  };

  if (isLoadingTransactions) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Boooking Transaction</h2>
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
    </div>
  );
};

export default Transactions;