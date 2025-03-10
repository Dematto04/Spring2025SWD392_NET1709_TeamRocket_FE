import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Calendar, CheckCheck, CircleX, MapPin, User } from "lucide-react";
import { useAprroveNewRequestMutation } from "@/redux/api/requestApi";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input"; // Assuming you're using shadcn/ui Input component

function RequestDetailSidebar({ service, housekeeper }) {
  const [approveNewRequest, { isLoading }] = useAprroveNewRequestMutation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproveAction, setIsApproveAction] = useState(true);
  const [reason, setReason] = useState(""); // State to store rejection reason

  const handleApprovalClick = (isApprove) => {
    setIsApproveAction(isApprove);
    setReason(""); // Reset reason when opening the modal
    setIsModalOpen(true);
  };

  const handleApproval = async () => {
    try {
      const payload = {
        service_id: service.service_id,
        is_approve: isApproveAction,
      };

      // Include reason in payload only for rejection
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
    <div className="">
      <div>Price</div>
      <div className="flex items-end justify-between mb-8">
        <div className="flex items-end gap-1">
          <h1 className="text-4xl font-bold">${service.service_price}</h1>
        </div>
        <Badge variant={service.service_status === "Pending" ? "secondary" : "success"}>
          {service.service_status}
        </Badge>
      </div>
      <Separator />
      <div>
        {/* Approve Button */}
        <Button
          variant="success"
          className="mt-8 w-full py-6 bg-green-500 hover:bg-green-600"
          disabled={isLoading || service.service_status !== "Pending"}
          onClick={() => handleApprovalClick(true)}
        >
          <CheckCheck />
          <span>Approve</span>
        </Button>

        {/* Reject Button */}
        <Button
          variant="destructive"
          className="mt-4 w-full py-6"
          disabled={isLoading || service.service_status !== "Pending"}
          onClick={() => handleApprovalClick(false)}
        >
          <CircleX />
          <span>Reject</span>
        </Button>
      </div>

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Confirm {isApproveAction ? "Approval" : "Rejection"}
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {isApproveAction ? "approve" : "reject"}{" "}
              this service request? This action cannot be undone.
            </p>

            {/* Reason Input for Rejection */}
            {!isApproveAction && (
              <div className="mb-6">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection (required)
                </label>
                <Input
                  id="reason"
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for rejection"
                  className="w-full"
                  required
                />
              </div>
            )}

            <div className="flex justify-end gap-4">
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
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-semibold mt-8">Provider Info</h1>
        <div className="w-full mt-8 py-6 bg-secondary flex flex-col items-center justify-center rounded-lg">
          <div>
            <img
              src="https://via.placeholder.com/150"
              className="w-20 h-20 rounded-full"
              alt={`${housekeeper.name}'s profile`}
            />
          </div>
          <div className="text-lg font-medium mt-4">{housekeeper.name}</div>
          {/* <Badge variant="outline" className="mt-2">
            {service.category_name}
          </Badge> */}
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>Created</span>
            </div>
            <div>{new Date(service.created_time).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>Address</span>
            </div>
            <div className="ml-6">{service.service_address}, {service.service_city}, {service.service_district}</div>
          </div>
        </div>
      </div>
      <Separator className="my-4" />
    </div>
  );
}

export default RequestDetailSidebar;