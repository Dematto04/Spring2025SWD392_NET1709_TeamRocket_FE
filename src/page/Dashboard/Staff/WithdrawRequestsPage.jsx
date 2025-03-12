import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useGetWalletTransactionQuery, useProcessWithdrawMutation } from '@/redux/api/walletApi';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TRANSACTION_FILTERS = [
  {
    value: 'WithdrawRequestStaff',
    label: 'Pending Requests',
  },
  {
    value: 'WithdrawStaff',
    label: 'Approved Withdrawals',
  },
  {
    value: 'WithdrawRejectStaff',
    label: 'Rejected Withdrawals',
  },
];

export default function WithdrawRequestsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('WithdrawRequestStaff');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'

  const { data: transactions, isLoading } = useGetWalletTransactionQuery({
    pageIndex: currentPage,
    pageSize: 10,
    transactionType: filter
  });

  const [processWithdraw, { isLoading: isProcessing }] = useProcessWithdrawMutation();

  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
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

  const handleAction = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    try {
      await processWithdraw({
        transId: selectedRequest.id,
        action: actionType === 'approve'
      }).unwrap();

      toast({
        title: "Success",
        description: `Withdrawal request ${actionType}d successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error?.data?.messages?.Error?.[0] || `Failed to ${actionType} withdrawal`,
        variant: "destructive"
      });
    } finally {
      setIsConfirmDialogOpen(false);
      setSelectedRequest(null);
      setActionType(null);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Withdrawal Requests</h1>
        <Select value={filter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select filter" />
          </SelectTrigger>
          <SelectContent>
            {TRANSACTION_FILTERS.map((filterOption) => (
              <SelectItem key={filterOption.value} value={filterOption.value}>
                {filterOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.data?.items.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{transaction.fullName}</p>
                    <p className="text-sm text-muted-foreground">{transaction.mail}</p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {formatAmount(transaction.amount)}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    transaction.status === 'Done' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status}
                  </span>
                </TableCell>
                <TableCell>{formatDate(transaction.createdDate)}</TableCell>
                <TableCell>
                  {filter === 'WithdrawRequestStaff' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAction(transaction, 'approve')}
                        disabled={isProcessing}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleAction(transaction, 'reject')}
                        disabled={isProcessing}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {transactions?.data?.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {transactions.data.totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === transactions.data.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'approve' ? 'Approve Withdrawal' : 'Reject Withdrawal'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionType} this withdrawal request for{' '}
              {formatAmount(selectedRequest?.amount)} by {selectedRequest?.fullName}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={actionType === 'approve' ? 'bg-primary' : 'bg-destructive'}
            >
              {actionType === 'approve' ? 'Approve' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 