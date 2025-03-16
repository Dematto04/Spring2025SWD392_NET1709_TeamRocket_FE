import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetRefundRequestDetailQuery } from '@/redux/api/requestApi';
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
  Link as LinkIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function RefundRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data, isLoading, error } = useGetRefundRequestDetailQuery(id);
  
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
                      <p className="text-sm text-muted-foreground">Proof of Payment</p>
                      <div className="flex items-center">
                        <LinkIcon className="h-4 w-4 text-muted-foreground mr-1" />
                        <p className="font-medium">{detail.proofOfPayment}</p>
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
        
        <CardFooter className="border-t bg-muted/20 flex justify-between py-4">
          <div className="text-sm text-muted-foreground">
            {detail.status === 'Pending' ? 
              'This request is awaiting review.' : 
              `This request has been ${detail.status.toLowerCase()}.`
            }
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 