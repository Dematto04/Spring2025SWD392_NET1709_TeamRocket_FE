import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGetAddressesQuery, useAddAddressMutation, useUpdateAddressMutation } from "@/redux/api/addressApi";

const AddressList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: "",
    address: "",
    city: "",
    province: "",
    zipCode: "", // Match API field name
    isDefault: false,
  });

  const addressesPerPage = 5;

  const { data, isLoading, isError } = useGetAddressesQuery({
    pageIndex: currentPage,
    pageSize: addressesPerPage,
  });

  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();

  // Map the items from data.data.items
  const addresses = data?.data?.items?.map((addr) => ({
    id: addr.id,
    name: addr.title,
    details: `${addr.address}, ${addr.city}, ${addr.province}`,
    zipCode: addr.zipCode, // Match API field name
    address: addr.address,
    city: addr.city,
    title:addr.title,
    province: addr.province,
    isDefault: addr.isDefault,
  })) || [];

  const totalPages = data?.data?.totalPages || 1;
  const currentAddresses = addresses;

  const openDialog = (address = null) => {
    setSelectedAddress(address);
    setNewAddress(
      address
        ? { ...address }
        : { title: "", address: "", city: "", province: "", zipCode: "", isDefault: false }
    );
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedAddress(null);
  };

  const saveAddress = async () => {
    try {
      if (selectedAddress) {
        await updateAddress({
          id: selectedAddress.id,
          ...newAddress,
        }).unwrap();
        console.log("Address updated successfully!");
      } else {
        await addAddress(newAddress).unwrap();
        console.log("Address added successfully!");
      }
      closeDialog();
    } catch (err) {
      console.error("Failed to save address:", err);
      alert("Failed to save address. Please try again.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading addresses</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Saved Addresses</h2>
      <div className="mb-6">
        <Button onClick={() => openDialog()}>Add Address</Button>
      </div>
      {currentAddresses.map((address) => (
        <Card
          key={address.id}
          className="mb-4 border border-gray-300 rounded-lg cursor-pointer"
          onClick={() => openDialog(address)}
        >
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg">{address.name}</h3>
            <p className="text-gray-600">Zipcode: {address.zipCode}</p>
            <p className="text-gray-600">Location: {address.details}</p>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center items-center gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          {"< Prev"}
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            variant={currentPage === index + 1 ? "default" : "outline"}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          {"Next >"}
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAddress ? "Edit Address" : "Add Address"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={newAddress.title}
              onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
            />
            <Input
              placeholder="Address"
              value={newAddress.address}
              onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
            />
            <Input
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            />
            <Input
              placeholder="Province"
              value={newAddress.province}
              onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
            />
            <Input
              placeholder="Zipcode"
              value={newAddress.zipCode}
              onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newAddress.isDefault}
                onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
              />
              <span>Set as Default</span>
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={saveAddress} disabled={isAdding || isUpdating}>
              {selectedAddress ? "Save Changes" : "Add Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressList;