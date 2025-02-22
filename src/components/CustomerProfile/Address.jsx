import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const initialAddresses = [
  { id: 1, name: "Home", details: "123 Main Street, New York, NY, USA" },
  { id: 2, name: "Work", details: "456 Business Ave, Los Angeles, CA, USA" },
  { id: 3, name: "Parents' House", details: "789 Family Rd, Chicago, IL, USA" },
  { id: 4, name: "Vacation Home", details: "101 Beach Drive, Miami, FL, USA" },
  { id: 5, name: "Friend's Place", details: "202 Party St, Las Vegas, NV, USA" },
  { id: 6, name: "Apartment", details: "500 City Center, Seattle, WA, USA" },
  { id: 7, name: "Cabin", details: "777 Mountain Road, Denver, CO, USA" },
  { id: 8, name: "Cousin's Home", details: "999 River St, Houston, TX, USA" },
  { id: 9, name: "Warehouse", details: "333 Industrial Way, Detroit, MI, USA" },
  { id: 10, name: "Hotel", details: "888 Luxury Ave, San Francisco, CA, USA" },
];

const AddressList = () => {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: "", details: "" });
  
  const addressesPerPage = 5;
  const totalPages = Math.ceil(addresses.length / addressesPerPage);
  const currentAddresses = addresses.slice((currentPage - 1) * addressesPerPage, currentPage * addressesPerPage);

  const openDialog = (address = null) => {
    setSelectedAddress(address);
    setNewAddress(address ? { ...address } : { name: "", details: "" });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const saveAddress = () => {
    if (selectedAddress) {
      setAddresses((prev) => prev.map((addr) => (addr.id === selectedAddress.id ? newAddress : addr)));
    } else {
      setAddresses((prev) => [...prev, { id: prev.length + 1, ...newAddress }]);
    }
    closeDialog();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Saved Addresses</h2>
      <div className="mt-6">
        <Button onClick={() => openDialog()}>Add Address</Button>
      </div>
      {currentAddresses.map((address) => (
        <Card key={address.id} className="mb-4 border border-gray-300 rounded-lg cursor-pointer" onClick={() => openDialog(address)}>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg">{address.name}</h3>
            <p className="text-gray-600">{address.details}</p>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center items-center gap-2 mt-4">
        <Button variant="outline" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          &lt; Prev
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button key={index} variant={currentPage === index + 1 ? "default" : "outline"} onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </Button>
        ))}
        <Button variant="outline" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next &gt;
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAddress ? "Edit Address" : "Add Address"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Name" value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} />
            <Input placeholder="Details" value={newAddress.details} onChange={(e) => setNewAddress({ ...newAddress, details: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={saveAddress}>{selectedAddress ? "Save Changes" : "Add Address"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressList