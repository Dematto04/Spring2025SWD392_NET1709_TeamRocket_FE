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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  CalendarDays,
  Loader2,
  MapPin,
  Mail,
  PhoneIcon,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useGetBookingDetailQuery } from "@/redux/api/bookingApi";
import { Separator } from "../ui/separator";
import { format, parseISO } from "date-fns";

const TRANSACTION_TYPES = [
  {
    value: "ShowAllHistoryUser",
    label: "All Transactions",
    description: "Show all transaction history",
    icon: <DollarSign className="h-4 w-4" />,
  },
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
    value: "WalletPurchase",
    label: "Wallet Purchase",
    description: "Show all booking transactions by wallet ",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    value: "VNPayPurchase",
    label: "VNPay Purchase",
    description: "Show all booking transactions by VNPay",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    value: "BookingCanceledPayback",
    label: "Payback transactions by cancel",
    description: "Show all cancel transaction ",
    icon: <DollarSign className="h-4 w-4" />,
  },
];

const WalletTransactionHistory = ({ formatAmount, formatDate }) => {
  // States
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [transactionType, setTransactionType] = useState("ShowAllHistoryUser");
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // API Hooks
  const { data: transactions, isLoading: isLoadingTransactions } =
    useGetWalletTransactionQuery({
      pageIndex: page,
      pageSize: pageSize,
      transactionType: transactionType,
    });
  const { data: bookingDetailResponse, isLoading: isDetailLoading } =
    useGetBookingDetailQuery(selectedBookingId, { skip: !selectedBookingId });

  const handleTransactionTypeChange = (value) => {
    setTransactionType(value);
    setPage(1);
  };
  const bookingDetail = bookingDetailResponse?.data;
  const formatDateTime = (dateString, timeString) => {
    try {
      const date = parseISO(dateString);
      return `${format(date, "dd/MM/yyyy")} ${timeString || ""}`;
    } catch (e) {
      // Handle the case where date might not be a valid ISO string
      return `${dateString?.split("T")[0] || "N/A"} ${timeString || ""}`;
    }
  };
   const formatPaymentDate = (dateString) => {
      if (!dateString) return "N/A";
      try {
        const date = parseISO(dateString);
        return format(date, "dd/MM/yyyy HH:mm");
      } catch (e) {
        return dateString;
      }
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
      case "WalletPurchase":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
          >
            <DollarSign className="h-3 w-3" />
            <span>Wallet Purchase</span>
          </Badge>
        );
      case "VNPayPurchase":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
          >
            <DollarSign className="h-3 w-3" />
            <span>VNPay Purchase</span>
          </Badge>
        );
      case "BookingCanceledPayback":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <DollarSign className="h-3 w-3" />
            <span>Payback</span>
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

  // Get amount styling based on transaction type
  const getAmountStyling = (type) => {
    switch (type) {
      case "WalletPurchase":
        return { color: "text-red-600", prefix: "-" };
      case "VNPayPurchase":
        return { color: "text-blue-600", prefix: "" };
      case "BookingCanceledPayback":
        return { color: "text-green-600", prefix: "+" };
      case "Withdraw":
        return { color: "text-red-600", prefix: "-" };
      case "Deposit":
        return { color: "text-green-600", prefix: "+" };
      default:
        return { color: "text-gray-600", prefix: "" };
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
              {transactions?.data?.items.map((transaction, index) => {
                const { color, prefix } = getAmountStyling(transaction.type);
                return (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card
                      className="overflow-hidden hover:shadow-md transition-shadow"
                      onClick={() =>
                        setSelectedBookingId(transaction?.referenceId)
                      }
                    >
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4">
                          <div className="flex items-start md:items-center gap-3 mb-3 md:mb-0">
                            <div
                              className={`p-2 rounded-full ${
                                transaction.type === "Deposit"
                                  ? "bg-blue-100"
                                  : transaction.type === "Withdraw"
                                  ? "bg-purple-100"
                                  : transaction.type === "WalletPurchase"
                                  ? "bg-red-100"
                                  : transaction.type === "VNPayPurchase"
                                  ? "bg-blue-100"
                                  : transaction.type ===
                                    "BookingCanceledPayback"
                                  ? "bg-green-100"
                                  : "bg-gray-100"
                              }`}
                            >
                              {transaction.type === "Deposit" ? (
                                <ArrowDownLeft className="h-5 w-5 text-blue-600" />
                              ) : transaction.type === "Withdraw" ? (
                                <ArrowUpRight className="h-5 w-5 text-purple-600" />
                              ) : (
                                <DollarSign className="h-5 w-5 text-gray-600" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {getTypeBadge(transaction.type)}
                                {getStatusBadge(transaction.status)}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {formatDate(transaction.createdDate)}
                                </span>
                              </div>
                              {transaction.referenceId && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <CreditCard className="h-3 w-3" />
                                  <span>Ref: {transaction.referenceId}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-xl font-bold ${color}`}>
                              {prefix} {formatAmount(transaction.amount)}
                            </span>
                            {transaction.currentAmount !== undefined &&
                              transaction.afterAmount !== undefined && (
                                <span className="text-sm text-muted-foreground">
                                  Before:{" "}
                                  {formatAmount(transaction.currentAmount)} -
                                  After: {formatAmount(transaction.afterAmount)}
                                </span>
                              )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
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
      <Dialog
        open={selectedBookingId !== null}
        onOpenChange={(open) => !open && setSelectedBookingId(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-6 -mr-6">
            {isDetailLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : bookingDetail ? (
              <div className="space-y-6">
                {/* Service Info Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-lg">
                      {bookingDetail?.serviceName}
                    </h3>
                    <Badge className="capitalize">
                      {bookingDetail?.status === "OnGoing"
                        ? "Ongoing"
                        : bookingDetail?.status}
                    </Badge>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">
                        {formatDateTime(bookingDetail?.preferDateStart, "")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {bookingDetail?.timeStart} - {bookingDetail?.timeEnd}(
                        {bookingDetail?.cleaningServiceDuration}{" "}
                        {bookingDetail?.cleaningServiceDuration > 1
                          ? "hours"
                          : "hour"}
                        )
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{bookingDetail.location}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-medium">Additional Services</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    {bookingDetail?.bookings &&
                    bookingDetail?.bookings.length > 0 ? (
                      bookingDetail?.bookings.map((additional, index) => (
                        <div
                          key={additional.additionalId}
                          className={`flex items-center justify-between ${
                            index !== bookingDetail?.bookings.length - 1
                              ? "pb-3 border-b border-gray-200"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded overflow-hidden">
                              <img
                                src={additional?.url}
                                alt={additional?.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {additional?.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {additional?.duration} minutes
                              </p>
                            </div>
                          </div>
                          <div className="text-sm font-semibold">
                            ${additional?.price.toFixed(2)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No additional services booked
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Payment Info Section */}
                <div className="space-y-3">
                  <h3 className="font-medium">Payment Information</h3>
                  <div className="grid grid-cols-2 gap-y-2">
                    <div className="text-sm text-gray-500">Payment Method:</div>
                    <div className="text-sm font-medium flex items-center gap-1">
                      <CreditCard className="h-3.5 w-3.5" />
                      {bookingDetail?.paymentMethod}
                    </div>

                    <div className="text-sm text-gray-500">Payment Status:</div>
                    <Badge
                      className="w-fit capitalize"
                    >
                      {bookingDetail?.paymentStatus}
                    </Badge>

                    <div className="text-sm text-gray-500">Payment Date:</div>
                    <div className="text-sm">
                      {formatPaymentDate(bookingDetail?.paymentDate)}
                    </div>

                    <div className="text-sm text-gray-500">Total Amount:</div>
                    <div className="text-sm font-semibold">
                      ${bookingDetail?.totalPrice}
                    </div>
                  </div>
                </div>


                <Separator />
                <div className="space-y-3">
                  <h3 className="font-medium">Proof</h3>
                  <div className="grid grid-cols-2 gap-y-2">
                    <div className="text-sm text-gray-500">Proof image:</div>
                    {bookingDetail?.proof ? (
                      <div className="text-sm font-medium flex items-center gap-1">
                        <img src={bookingDetail?.proof} alt="" />
                      </div>
                    ) : (
                      <div className="text-sm font-medium flex items-center gap-1">
                        No proof uploaded!
                      </div>
                    )}
                  </div>
                </div>
                <Separator />
                {/* housekeeper Info Section */}
                <div className="space-y-3">
                  <h3 className="font-medium">Housekeeper Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="font-medium">
                      {bookingDetail?.housekeeperName}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{bookingDetail?.houseKeeperMail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <PhoneIcon className="h-4 w-4 text-gray-500" />
                      <span>{bookingDetail?.houseKeeperPhoneNumber}</span>
                    </div>
                  </div>
                </div>
                {/* Customer Info Section */}
                <div className="space-y-3">
                  <h3 className="font-medium">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="font-medium">
                      {bookingDetail.customerName}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{bookingDetail.customerMail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <PhoneIcon className="h-4 w-4 text-gray-500" />
                      <span>{bookingDetail.customerPhoneNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Notes Section - Only show if notes exist */}
                {bookingDetail.note && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-medium">Notes</h3>
                      <div className="flex gap-2 bg-yellow-50 p-3 rounded-md">
                        <FileText className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{bookingDetail?.note}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Booking details not available
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WalletTransactionHistory;
