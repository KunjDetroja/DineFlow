import React from "react";
import AddTableDialog from "@/pages/tables/AddTableDialog";
import CreateRestaurantDialog from "@/pages/restaurants/CreateRestaurantDialog";
import CreateUpdateUserDialog from "@/pages/staff/CreateUpdateUserDialog";

export interface DialogConfig {
  component: React.ComponentType<{ onClose: () => void }>;
  maxWidth?: string;
}

export const dialogRegistry: Record<string, DialogConfig> = {
  "add-table": {
    component: AddTableDialog,
    maxWidth: "sm:max-w-[500px]"
  },
  "create-restaurant": {
    component: CreateRestaurantDialog,
    maxWidth: "sm:max-w-[600px]"
  },
  "create-staff":{
    component: CreateUpdateUserDialog,
    maxWidth: "sm:max-w-[600px]"
  }
  // Add more dialogs here as needed
  // "add-menu-item": {
  //   component: AddMenuItemDialog,
  //   maxWidth: "sm:max-w-[600px]"
  // },
};

export const getDialogConfig = (buttonKey: string): DialogConfig | null => {
  return dialogRegistry[buttonKey] || null;
};