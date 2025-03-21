import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetWalletTransactionQuery } from "@/redux/api/walletApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  DollarSign,
  Calendar,
  CreditCard,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

const TRANSACTION_TYPES = [
  {
    value: "WithdrawRequestUser",
    label: "Withdraw Requests",
    description: "Show withdraw requests by user",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    value: "WithdrawUser",
    label: "Withdrawals",
    description: "Show withdrawals by user",
    icon: <ArrowUpRight className="h-4 w-4" />,
  },
  {
    value: "WithdrawRejectUser",
    label: "Rejected Withdrawals",
    description: "Show rejected withdrawals by user",
    icon: <XCircle className="h-4 w-4" />,
  },
  {
    value: "ShowWithdrawHistoryUser",
    label: "Withdrawal History",
    description: "Show all withdrawal transactions",
    icon: <RefreshCw className="h-4 w-4" />,
  },
  {
    value: "Deposit",
    label: "Deposits",
    description: "Show deposit transactions",
    icon: <ArrowDownLeft className="h-4 w-4" />,
  },
  {
    value: "ShowAllHistoryUser",
    label: "All Transactions",
    description: "Show all transaction history",
    icon: <DollarSign className="h-4 w-4" />,
  },
];

const WalletTransactionHistory = ({ formatAmount, formatDate }) => {
  // States
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [transactionType, setTransactionType] = useState("ShowAllHistoryUser");

  // API Hooks
  const { data: transactions, isLoading: isLoadingTransactions } =
    useGetWalletTransactionQuery({
      pageIndex: page,
      pageSize: pageSize,
      transactionType: transactionType,
    });

  const handleTransactionTypeChange = (value) => {
    setTransactionType(value);
    setPage(1);
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "Done":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            <span>Completed</span>
          </Badge>
        );
      case "Pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
      case "Rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
          >
            <XCircle className="h-3 w-3" />
            <span>Rejected</span>
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            {status}
          </Badge>
        );
    }
  };

  // Get transaction type badge
  const getTypeBadge = (type) => {
    switch (type) {
      case "Deposit":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
          >
            <ArrowDownLeft className="h-3 w-3" />
            <span>Deposit</span>
          </Badge>
        );
      case "Withdraw":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1"
          >
            <ArrowUpRight className="h-3 w-3" />
            <span>Withdraw</span>
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            {type}
          </Badge>
        );
    }
  };

  return (
    <Card className="space-y-6">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          View and filter your transaction history
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-72">
            <Select
              value={transactionType}
              onValueChange={handleTransactionTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      {type.icon}
                      <div className="flex flex-col">
                        <span>{type.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {type.description}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Transactions Table */}
        {isLoadingTransactions ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row justify-between p-4 border rounded-lg"
              >
                <div className="space-y-2 mb-3 md:mb-0">
                  <Skeleton className="h-5 w-[100px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-[80px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
            ))}
          </div>
        ) : transactions?.data?.items?.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <div className="flex justify-center mb-3">
              <AlertCircle className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No transactions found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try changing your filter settings
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {transactions?.data?.items.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row md:items-center justify-between p-4">
                        <div className="flex items-start md:items-center gap-3 mb-3 md:mb-0">
                          <div
                            className={`p-2 rounded-full ${
                              transaction.type === "Deposit"
                                ? "bg-blue-100"
                                : "bg-purple-100"
                            }`}
                          >
                            {transaction.type === "Deposit" ? (
                              <ArrowDownLeft
                                className={`h-5 w-5 text-blue-600`}
                              />
                            ) : (
                              <ArrowUpRight
                                className={`h-5 w-5 text-purple-600`}
                              />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {getTypeBadge(transaction.type)}
                              {getStatusBadge(transaction.status)}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(transaction.createdDate)}</span>
                            </div>
                            {transaction.referenceId && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <CreditCard className="h-3 w-3" />
                                <span>Ref: {transaction.referenceId}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`text-xl font-bold ${
                              transaction.type === "Withdraw"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {transaction.type === "Withdraw" ? "- " : "+ "}
                            {formatAmount(transaction.amount)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {transactions?.data?.totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize, transactions.data.totalCount)} of{" "}
              {transactions.data.totalCount}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={!transactions.data.hasPrevious}
                className="h-8 w-8 p-0 rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {page} of {transactions.data.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!transactions.data.hasNext}
                className="h-8 w-8 p-0 rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletTransactionHistory;
