import { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ServiceBookContext } from "./ServiceBookContext";
import { useUpdateAddressMutation } from "@/redux/api/addressApi";

export default function AddressList({ addressList = [], setDefaultAddress}) {
  const defaultAddress =
    addressList.find((addr) => addr.isDefault) || addressList[0] || null;
  const [selectedAddress, setSelectedAddress] = useState(defaultAddress);
  const [tempSelected, setTempSelected] = useState(defaultAddress);
  const [isOpen, setIsOpen] = useState(false);
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [updateAddress, {isLoading}] = useUpdateAddressMutation()
  const { form } = useContext(ServiceBookContext);

  const handleSave = async () => {
    if (!tempSelected) return;

    setSelectedAddress(tempSelected);
    setDefaultAddress({
        defaultAddress: tempSelected.address,
        defaultAddressId: tempSelected.placeId
    })
    form.setValue("location", tempSelected?.placeId);
    form.setValue("city", tempSelected?.city || "");
    form.setValue("district", tempSelected?.district || "");
    form.setValue("address_line", tempSelected.address || "");
    form.setValue("place_id", tempSelected.placeId);
    form.setValue("addressId", tempSelected.id)
    if(setAsDefault){
        updateAddress({...tempSelected, isDefault: true})
    }
    setIsOpen(false);
  };

  if (!addressList.length) {
    return <p>No address found</p>;
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Change Address</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md w-full ">
          <DialogHeader>
            <DialogTitle>Your Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-scroll">
            <Card className="p-3 flex justify-between items-center cursor-pointer transition hover:bg-gray-100">
              <div>
                <p className="font-medium">{defaultAddress.title}</p>
                <p className="text-sm text-gray-500">
                  {defaultAddress.address}
                </p>
              </div>
              {defaultAddress.isDefault && <Badge>Default</Badge>}
            </Card>
            <div className="p-4">
              <Separator />
            </div>
            {addressList.map(
              (addr) =>
                !addr.isDefault && (
                  <Card
                    key={addr.id}
                    className={`p-3 flex justify-between items-center cursor-pointer transition ${
                      tempSelected?.id === addr.id
                        ? "border-primary"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setTempSelected(addr);
                      setSetAsDefault(false);
                    }}
                  >
                    <div>
                      <p className="font-medium">{addr.title}</p>
                      <p className="text-sm text-gray-500">{addr.address}</p>
                    </div>
                  </Card>
                )
            )}
          </div>

          {tempSelected?.id !== selectedAddress?.id && (
            <div className="flex items-center gap-2 mt-3">
              <Checkbox
                id="set-default"
                checked={setAsDefault}
                onCheckedChange={setSetAsDefault}
              />
              <label htmlFor="set-default" className="text-sm cursor-pointer">
                Mark as default
              </label>
            </div>
          )}

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={!tempSelected}>
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
