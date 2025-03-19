import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { ArrowLeft, Check, X, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useGetRegisterRequestDetailQuery, useApproveRegisterRequestMutation } from '@/redux/api/requestApi';
import { useGetCategoriesQuery } from '@/redux/api/serviceApi';
import { Skeleton } from "@/components/ui/skeleton";
import LoadingSkeleton from '@/components/RegisterRequest/LoadingSkeleton';


function RegisterApproveDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [approveRegisterRequest, { isLoading: isApproving }] = useApproveRegisterRequestMutation();


  const { data: registrationData, isLoading, isSuccess } = useGetRegisterRequestDetailQuery(id);
  const { data: categoriesData } = useGetCategoriesQuery();

  const registration = registrationData?.data;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Pending Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const getCategoryName = (categoryId) => {
    return categoriesData?.data?.find(cat => cat.id === categoryId)?.name || categoryId;
  };

  const handleApprove = async () => {
    try {
      await approveRegisterRequest({
        housekeeper_id: id,
        is_approve: true,
        reason: '',
      }).unwrap();

      toast({
        title: "Success",
        description: "Registration approved successfully",
      });
      navigate('/dashboard/staff/register-approve');
    } catch (error) {
      console.log(error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error.data?.messages?.Error?.[0] || "Failed to approve registration",
      });
    }
  };
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a reason for rejection",
      });
      return;
    }

    try {
      await approveRegisterRequest({
        housekeeper_id: id,
        is_approve: false,
        reason: rejectReason,
      }).unwrap();

      toast({
        title: "Success",
        description: "Registration rejected successfully",
      });
      navigate('/dashboard/staff/register-approve');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.data?.messages?.Error?.[0] || "Failed to reject registration",
      });
    }
  };

  if (isLoading || !isSuccess || !registration) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard/staff/register-approve')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Registration Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={registration.avatar} />
                  <AvatarFallback>{registration.full_name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{registration.full_name}</h2>
                  <p className="text-gray-500">{registration.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p>{registration.phone_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{registration.housekeeper_address_line}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">District</p>
                  <p>{registration.housekeeper_district}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p>{registration.housekeeper_city}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="id-card">
                <TabsList>
                  <TabsTrigger value="id-card">ID Card</TabsTrigger>
                  <TabsTrigger value="cv">CV</TabsTrigger>
                </TabsList>
                <TabsContent value="id-card" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Front Side</p>
                      <img
                        src={registration.id_card_front}
                        alt="ID Card Front"
                        className="w-full rounded-lg border"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Back Side</p>
                      <img
                        src={registration.id_card_back}
                        alt="ID Card Back"
                        className="w-full rounded-lg border"
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="cv">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">CV Document</p>
                    <img
                      src={registration.certificate_picture}
                      alt="CV"
                      className="w-full rounded-lg border"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={getStatusColor(registration.housekeeper_status)}>
                {getStatusText(registration.housekeeper_status)}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selected Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {registration.housekeeper_categories.map((categoryId) => (
                  <Badge key={categoryId} variant="secondary">
                    {getCategoryName(categoryId)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {registration.housekeeper_status === 'Pending' && (
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                variant="outline"
                onClick={() => setShowRejectDialog(true)}
                disabled={isApproving}
              >
                {isApproving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <X className="w-4 h-4 mr-2" />
                )}
                Reject
              </Button>
              <Button 
                className="flex-1"
                onClick={() => setShowApproveDialog(true)}
                disabled={isApproving}
              >
                {isApproving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Approve
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Approve Confirmation Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Approval</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this registration? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowApproveDialog(false)}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApprove}
              disabled={isApproving}
            >
              {isApproving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                'Confirm Approval'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Registration</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this registration.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
              disabled={isApproving}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowRejectDialog(false)}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={isApproving}
            >
              {isApproving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Confirm Rejection'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RegisterApproveDetail;