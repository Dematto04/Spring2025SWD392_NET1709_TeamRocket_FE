import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetRefundRequestDetailQuery, useProcessRefundMutation } from '@/redux/api/requestApi';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Calendar,
  User,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Link as LinkIcon,
  Image,
  ExternalLink,
  ZoomIn
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function RefundRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data, isLoading, error, refetch } = useGetRefundRequestDetailQuery(id);
  
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  
  const [processRefund, { isLoading: isProcessing }] = useProcessRefundMutation();
  
  const [showImagePreview, setShowImagePreview] = useState(false);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy HH:mm');
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'Approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'Done':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Done':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const handleProcessRefund = async (approve) => {
    try {
      await processRefund({
        refundRequestId: id,
        action: approve
      }).unwrap();
      
      toast({
        title: approve ? "Refund Approved" : "Refund Rejected",
        description: approve 
          ? "The refund request has been approved successfully." 
          : "The refund request has been rejected.",
      });
      
      setShowApproveDialog(false);
      setShowRejectDialog(false);
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to process refund request. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Request</h2>
            <p className="text-muted-foreground mb-6">
              There was a problem loading the refund request details.
            </p>
            <Button onClick={() => navigate('/dashboard/staff/refund-requests')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Refund Requests
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const detail = data?.data;
  
  if (!detail) {
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Request Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The refund request you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/dashboard/staff/refund-requests')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Refund Requests
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/staff/refund-request')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Refund Requests
        </Button>
        
        <Badge className={cn("px-3 py-1 text-sm", getStatusColor(detail.status))}>
          {getStatusIcon(detail.status)}
          <span className="ml-1">{detail.status}</span>
        </Badge>
      </div>
      
      <Card className="shadow-md">
        <CardHeader className="border-b bg-muted/40">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Refund Request Details</CardTitle>
              <CardDescription>
                Request ID: {detail.id}
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {detail.resolutionDate ? 
                <span>Resolved on {formatDate(detail.resolutionDate)}</span> : 
                <span>Awaiting resolution</span>
              }
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="mr-2 h-5 w-5 text-primary" />
                  Customer Information
                </h3>
                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{detail.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-muted-foreground mr-1" />
                      <p className="font-medium">{detail.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-muted-foreground mr-1" />
                      <p className="font-medium">{detail.phoneNumber}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer ID</p>
                    <p className="font-medium text-sm font-mono">{detail.customerId}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Booking Information
                </h3>
                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Booking ID</p>
                    <p className="font-medium font-mono">{detail.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium text-xl text-primary">{formatCurrency(detail.totalPrice)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Refund Details
                </h3>
                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Reason for Refund</p>
                    <p className="font-medium">{detail.reason}</p>
                  </div>
                  
                  {detail.proofOfPayment && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Proof of Payment</p>
                      <div className="border rounded-md p-2 bg-background">
                        <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted/20">
                          <img 
                            src={detail.proofOfPayment} 
                            alt="Payment proof" 
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/400x300?text=Image+Not+Available";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="secondary"
                                className="bg-white/80 hover:bg-white"
                                onClick={() => setShowImagePreview(true)}
                              >
                                <ZoomIn className="h-4 w-4 mr-1" />
                                View Larger
                              </Button>
                              <Button 
                                size="sm" 
                                variant="secondary"
                                className="bg-white/80 hover:bg-white"
                                onClick={() => window.open(detail.proofOfPayment, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Open Original
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {detail.acceptBy && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <User className="mr-2 h-5 w-5 text-primary" />
                    Resolution Information
                  </h3>
                  <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Resolved By</p>
                      <p className="font-medium">{detail.acceptByName || detail.acceptBy}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Resolution Date</p>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                        <p className="font-medium">{formatDate(detail.resolutionDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        {detail.status === 'Pending' && (
          <CardFooter className="border-t bg-muted/20 flex justify-between py-4">
            <div className="text-sm text-muted-foreground">
              Please review this refund request carefully before taking action.
            </div>
            <div className="flex gap-3">
              <Button
                variant="destructive"
                onClick={() => setShowRejectDialog(true)}
                disabled={isProcessing}
              >
                Reject Refund
              </Button>
              <Button
                variant="default"
                onClick={() => setShowApproveDialog(true)}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve Refund
              </Button>
            </div>
          </CardFooter>
        )}
        
        {detail.status !== 'Pending' && (
          <CardFooter className="border-t bg-muted/20 flex justify-between py-4">
            <div className="text-sm text-muted-foreground">
              {detail.status === 'Approved' ? 
                'This request has been approved and is being processed.' : 
                detail.status === 'Rejected' ?
                'This request has been rejected.' :
                `This request has been ${detail.status.toLowerCase()}.`
              }
            </div>
          </CardFooter>
        )}
      </Card>
      
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Refund Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this refund request? This action will process a refund of {formatCurrency(detail?.totalPrice)} to the customer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleProcessRefund(true);
              }}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                "Yes, Approve Refund"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Refund Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this refund request? This action cannot be undone and the customer will not receive a refund.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleProcessRefund(false);
              }}
              disabled={isProcessing}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                "Yes, Reject Refund"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-1 overflow-hidden">
          <div className="relative w-full h-full">
            <div className="absolute top-2 right-2 z-10">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-black/50 hover:bg-black/70 text-white"
                onClick={() => setShowImagePreview(false)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="w-full h-full overflow-auto p-4">
              <img 
                src={detail?.proofOfPayment} 
                alt="Payment proof" 
                className="max-w-full h-auto mx-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/800x600?text=Image+Not+Available";
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 