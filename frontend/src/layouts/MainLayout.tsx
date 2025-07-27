import { Plus } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getDialogConfig } from "@/config/dialogs";

interface MainLayoutProps {
  title: string;
  buttonTitle?: string;
  buttonKey?: string;
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  title,
  buttonTitle,
  buttonKey,
  children,
}) => {
  const [open, setOpen] = useState(false);

  const dialogConfig = buttonKey ? getDialogConfig(buttonKey) : null;
  const DialogComponent = dialogConfig?.component;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h1>
        {buttonTitle && buttonKey && DialogComponent && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="xs">
                <Plus size={18} />
                {buttonTitle}
              </Button>
            </DialogTrigger>
            <DialogContent
              className={dialogConfig?.maxWidth || "sm:max-w-[425px]"}
            >
              <DialogComponent onClose={handleClose} />
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="h-full">{children}</div>
    </div>
  );
};

export default MainLayout;
