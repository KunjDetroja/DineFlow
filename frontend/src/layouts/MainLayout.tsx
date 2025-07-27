import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  title: string;
  buttonTitle?: string;
  buttonLink?: string;
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ title, buttonTitle, buttonLink, children }) => {
  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{title}</h1>
        {buttonTitle && buttonLink && (
          <Link to={buttonLink}>
            <Button size='xs'>
              <Plus size={18} />
              {buttonTitle}
            </Button>
          </Link>
        )}
      </div>
      <div className="h-full">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
