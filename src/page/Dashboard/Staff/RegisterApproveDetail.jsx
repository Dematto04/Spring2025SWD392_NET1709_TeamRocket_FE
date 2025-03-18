import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { ArrowLeft, Check, X } from 'lucide-react';
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

function RegisterApproveDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Mock data - replace with actual API call
  const registration = {
    id: 1,
    fullName: "John Doe",
    email: "john@example.com",
    phone: "0123456789",
    status: "pending",
    submittedDate: "2024-03-15",
    avatar: "https://github.com/shadcn.png",
    dob: "1990-01-01",
    address: "123 Main St, City, Country",
    services: ["Cleaning", "Cooking", "Laundry"],
    idCardFront: "https://example.com/id-front.jpg",
    idCardBack: "https://example.com/id-back.jpg",
    cv: "https://example.com/cv.jpg",
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
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
    switch (status.toLowerCase()) {
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

  const handleApprove = async () => {
    try {
      // Replace with actual API call
      // await approveRegistration(id);
      toast({
        title: "Success",
        description: "Registration approved successfully",
      });
      navigate('/dashboard/staff/register-approve');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve registration",
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
      // Replace with actual API call
      // await rejectRegistration(id, rejectReason);
      toast({
        title: "Success",
        description: "Registration rejected successfully",
      });
      navigate('/dashboard/staff/register-approve');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject registration",
      });
    }
  };

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
                  <AvatarFallback>{registration.fullName.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{registration.fullName}</h2>
                  <p className="text-gray-500">{registration.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p>{registration.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p>{format(new Date(registration.dob), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{registration.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted Date</p>
                  <p>{format(new Date(registration.submittedDate), 'MMM d, yyyy')}</p>
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
                        src={registration.idCardFront}
                        alt="ID Card Front"
                        className="w-full rounded-lg border"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Back Side</p>
                      <img
                        src={registration.idCardBack}
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
                      src={registration.cv}
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
              <Badge className={getStatusColor(registration.status)}>
                {getStatusText(registration.status)}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selected Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {registration.services.map((service, index) => (
                  <Badge key={index} variant="secondary">
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button 
              className="flex-1" 
              variant="outline"
              onClick={() => setShowRejectDialog(true)}
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button 
              className="flex-1"
              onClick={() => setShowApproveDialog(true)}
            >
              <Check className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </div>
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
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove}>
              Confirm Approval
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
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RegisterApproveDetail;
