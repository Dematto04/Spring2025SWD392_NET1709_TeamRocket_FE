import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { format } from 'date-fns';
import { 
  useGetWalletTransactionQuery, 
  useSendWithdrawRequestMutation,
  useGetBalanceQuery,
  useCreateDepositPaymentMutation,
  useProcessDepositMutation,
  useGetMoneyExchangeQuery
} from '@/redux/api/walletApi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { useDebounce } from '@/hooks/useDebounce';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  DollarSign,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import WalletTransactionHistory from './WalletTransactionHistory';

const TRANSACTION_TYPES = [
  { 
    value: 'WithdrawRequestUser', 
    label: 'Withdraw Requests',
    description: 'Show withdraw requests by user',
    icon: <Clock className="h-4 w-4" />
  },
  { 
    value: 'WithdrawUser', 
    label: 'Withdrawals',
    description: 'Show withdrawals by user',
    icon: <ArrowUpRight className="h-4 w-4" />
  },
  { 
    value: 'WithdrawRejectUser', 
    label: 'Rejected Withdrawals',
    description: 'Show rejected withdrawals by user',
    icon: <XCircle className="h-4 w-4" />
  },
  { 
    value: 'ShowWithdrawHistoryUser', 
    label: 'Withdrawal History',
    description: 'Show all withdrawal transactions',
    icon: <RefreshCw className="h-4 w-4" />
  },
  { 
    value: 'Deposit', 
    label: 'Deposits',
    description: 'Show deposit transactions',
    icon: <ArrowDownLeft className="h-4 w-4" />
  },
  { 
    value: 'ShowAllHistoryUser', 
    label: 'All Transactions',
    description: 'Show all transaction history',
    icon: <DollarSign className="h-4 w-4" />
  }
];

const Wallet = () => {
  // States
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Debounced values
  const debouncedDepositAmount = useDebounce(depositAmount, 500);
  const debouncedWithdrawAmount = useDebounce(withdrawAmount, 500);

  // API Hooks
  const { data: transactions, isLoading: isLoadingTransactions } = useGetWalletTransactionQuery({
    pageIndex: 1,
    pageSize: 5,
    transactionType: 'ShowAllHistoryUser'
  });
  const { data: balanceData, isLoading: isLoadingBalance } = useGetBalanceQuery();
  const [createDepositPayment, { isLoading: isDepositLoading }] = useCreateDepositPaymentMutation();
  const [sendWithdrawRequest, { isLoading: isWithdrawLoading }] = useSendWithdrawRequestMutation();

  // Exchange queries
  const { data: depositExchangeData } = useGetMoneyExchangeQuery(debouncedDepositAmount || 0, {
    skip: !debouncedDepositAmount
  });

  const { data: withdrawExchangeData } = useGetMoneyExchangeQuery(debouncedWithdrawAmount || 0, {
    skip: !debouncedWithdrawAmount
  });

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

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM d, yyyy • HH:mm');
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate summary statistics
  // const calculateStats = () => {
  //   if (!transactions?.data?.items) return { deposits: 0, withdrawals: 0, pending: 0 };
    
  //   return transactions.data.items.reduce((stats, transaction) => {
  //     if (transaction.type === 'Deposit' && transaction.status === 'Done') {
  //       stats.deposits += transaction.amount;
  //     } else if (transaction.type === 'Withdraw' && transaction.status === 'Done') {
  //       stats.withdrawals += transaction.amount;
  //     } else if (transaction.status === 'Pending') {
  //       stats.pending += transaction.amount;
  //     }
  //     return stats;
  //   }, { deposits: 0, withdrawals: 0, pending: 0 });
  // };

  // const stats = calculateStats();

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Done':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Completed</span>
          </Badge>
        );
      case 'Pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
      case 'Rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>Rejected</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Balance Card */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary/90 to-primary p-6 text-primary-foreground">
              <div className="flex items-center gap-2 mb-2">
                <WalletIcon className="h-5 w-5" />
                <h3 className="text-lg font-medium">Your Balance</h3>
              </div>
              
              {isLoadingBalance ? (
                <Skeleton className="h-10 w-40 bg-white/20" />
              ) : (
                <div className="text-3xl font-bold">
                  {formatAmount(balanceData?.data || 0)}
                </div>
              )}
            </div>
            
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4 justify-between">
                <Button 
                  onClick={() => setIsDepositModalOpen(true)}
                  className="flex-1 min-w-[120px]"
                >
                  <ArrowDownLeft className="mr-2 h-4 w-4" />
                  Deposit
                </Button>
                <Button 
                  onClick={() => setIsWithdrawModalOpen(true)} 
                  variant="outline"
                  className="flex-1 min-w-[120px]"
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Stats Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Deposits</p>
                    <p className="text-2xl font-bold text-green-600">{formatAmount(stats.deposits)}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <ArrowDownLeft className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Withdrawals</p>
                    <p className="text-2xl font-bold text-purple-600">{formatAmount(stats.withdrawals)}</p>
                  </div>
                  <div className="bg-purple-100 p-2 rounded-full">
                    <ArrowUpRight className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pending Transactions</p>
                    <p className="text-2xl font-bold text-yellow-600">{formatAmount(stats.pending)}</p>
                  </div>
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div> */}
          
          {/* Recent Transactions */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Recent Transactions</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setActiveTab("transactions")}
                  className="text-primary"
                >
                  View All
                </Button>
              </div>
              <CardDescription>Your most recent financial activities</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isLoadingTransactions ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[100px]" />
                          <Skeleton className="h-3 w-[80px]" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-[80px]" />
                    </div>
                  ))}
                </div>
              ) : transactions?.data?.items?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="flex justify-center mb-2">
                    <AlertCircle className="h-8 w-8" />
                  </div>
                  <p>No transactions found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions?.data?.items.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'Deposit' ? 'bg-blue-100' : 'bg-purple-100'
                        }`}>
                          {transaction.type === 'Deposit' ? (
                            <ArrowDownLeft className={`h-5 w-5 text-blue-600`} />
                          ) : (
                            <ArrowUpRight className={`h-5 w-5 text-purple-600`} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(transaction.createdDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`font-semibold ${
                          transaction.type === 'Withdraw' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.type === 'Withdraw' ? '- ' : '+ '}
                          {formatAmount(transaction.amount)}
                        </span>
                        <div className="mt-1">
                          {getStatusBadge(transaction.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions">
          <WalletTransactionHistory formatAmount={formatAmount} formatDate={formatDate} />
        </TabsContent>
      </Tabs>

      {/* Deposit Modal */}
      <Dialog open={isDepositModalOpen} onOpenChange={setIsDepositModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowDownLeft className="h-5 w-5 text-primary" />
              Deposit to Wallet
            </DialogTitle>
            <DialogDescription>
              Add funds to your wallet using VNPay
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDeposit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Amount (USD)</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="pl-10 pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    USD
                  </span>
                </div>
                {depositAmount && depositExchangeData?.data && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <RefreshCw className="h-3 w-3" />
                    <span>≈ {depositExchangeData.data.toLocaleString()} VND</span>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100 text-sm text-blue-700 mt-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                  <div>
                    You will be redirected to VNPay to complete your deposit. The funds will be available in your wallet immediately after successful payment.
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDepositModalOpen(false)}
                disabled={isDepositLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isDepositLoading || !depositAmount || Number(depositAmount) <= 0}
              >
                {isDepositLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Proceed to Payment"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Withdraw Modal */}
      <Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-primary" />
              Withdraw from Wallet
            </DialogTitle>
            <DialogDescription>
              Request to withdraw funds from your wallet
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWithdraw}>
            <div className="grid gap-4 py-4">
              <div className="bg-muted p-3 rounded-md flex items-center justify-between">
                <span className="text-sm">Current Balance:</span>
                <span className="font-semibold">{formatAmount(balanceData?.data || 0)}</span>
              </div>
              
              <div className="space-y-2">
                <Label>Amount (USD)</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="pl-10 pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    USD
                  </span>
                </div>
                {withdrawAmount && withdrawExchangeData?.data && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <RefreshCw className="h-3 w-3" />
                    <span>≈ {withdrawExchangeData.data.toLocaleString()} VND</span>
                  </div>
                )}
              </div>
              
              {Number(withdrawAmount) > (balanceData?.data || 0) && (
                <div className="bg-red-50 p-3 rounded-md border border-red-100 text-sm text-red-700">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5" />
                    <div>
                      Withdrawal amount cannot exceed your current balance.
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-amber-50 p-3 rounded-md border border-amber-100 text-sm text-amber-700">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5" />
                  <div>
                    Withdrawal requests are typically processed within 1-3 business days. You will be notified once your request has been processed.
                  </div>
                </div>
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
                {isWithdrawLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Request Withdrawal"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wallet;