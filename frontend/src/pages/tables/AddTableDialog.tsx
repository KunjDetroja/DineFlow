import React from "react";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddTableDialogProps {
  onClose: () => void;
}

const AddTableDialog: React.FC<AddTableDialogProps> = ({ onClose }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Add table form submitted');
    onClose();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add New Table</DialogTitle>
        <DialogDescription>
          Create a new table for your restaurant. Fill in the details below.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="tableNumber">Table Number</Label>
            <Input id="tableNumber" placeholder="Enter table number" required />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input id="capacity" type="number" placeholder="Enter table capacity" required />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="Enter table location" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Add Table
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

export default AddTableDialog;