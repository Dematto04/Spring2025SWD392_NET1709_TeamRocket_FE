import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Calendar, CheckCheck, CircleX, MapPin, User, DollarSign, Clock } from "lucide-react";
import { useAprroveNewRequestMutation } from "@/redux/api/requestApi";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

function RequestDetailSidebar({ service, housekeeper }) {
  const [approveNewRequest, { isLoading }] = useAprroveNewRequestMutation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproveAction, setIsApproveAction] = useState(true);
  const [reason, setReason] = useState("");

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handleApprovalClick = (isApprove) => {
    setIsApproveAction(isApprove);
    setReason("");
    setIsModalOpen(true);
  };

  const handleApproval = async () => {
    try {
      const payload = {
        service_id: service.service_id,
        is_approve: isApproveAction,
      };

      if (!isApproveAction) {
        if (!reason.trim()) {
          toast({
            title: "Error",
            description: "Please provide a reason for rejection",
            variant: "destructive",
          });
          return;
        }
        payload.reason = reason;
      }

      const response = await approveNewRequest(payload).unwrap();

      toast({
        title: "Success",
        description: `Service ${isApproveAction ? "approved" : "rejected"} successfully`,
        variant: "success",
      });

      navigate("/dashboard/staff/requests");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isApproveAction ? "approve" : "reject"} service`,
        variant: "destructive",
      });
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Price Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign size={20} />
            Service Price
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold">${service.service_price}</span>
            </div>
            <Badge 
              className={`text-sm ${getStatusBadgeClasses(service.service_status)}`}
            >
              {service.service_status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {service.service_status === "Pending" && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Button
                variant="success"
                className="w-full py-6 bg-green-500 hover:bg-green-600"
                disabled={isLoading}
                onClick={() => handleApprovalClick(true)}
              >
                <CheckCheck className="mr-2" />
                <span>Approve Service</span>
              </Button>

              <Button
                variant="destructive"
                className="w-full py-6"
                disabled={isLoading}
                onClick={() => handleApprovalClick(false)}
              >
                <CircleX className="mr-2" />
                <span>Reject Service</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Provider Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={20} />
            Provider Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-semibold">
              {housekeeper.name.charAt(0).toUpperCase()}
            </div>
            <div className="mt-4 text-center">
              <div className="font-medium">{housekeeper.name}</div>
              <div className="text-sm text-muted-foreground">Service Provider</div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={16} />
                <span className="text-sm">Created</span>
              </div>
              <div className="text-sm">
                {new Date(service.created_time).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin size={16} />
                <span className="text-sm">Service Location</span>
              </div>
              <div className="text-sm ml-6">
                {service.service_address}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval/Rejection Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm {isApproveAction ? "Approval" : "Rejection"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Are you sure you want to {isApproveAction ? "approve" : "reject"} this service request? 
              This action cannot be undone.
            </p>
          </div>
          {!isApproveAction && (
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Reason for Rejection
              </label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for rejection"
                required
              />
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant={isApproveAction ? "success" : "destructive"}
              onClick={handleApproval}
              disabled={isLoading}
              className={isApproveAction ? "bg-green-500 hover:bg-green-600" : ""}
            >
              {isLoading ? "Processing..." : isApproveAction ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RequestDetailSidebar;