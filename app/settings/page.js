import CardWrapper from "@/components/card-wrapper";
import UserSettings from "@/components/user-settings";
import React from "react";

const SettingsPage = () => {
  return (
    <div className="h-full flex items-center justify-center font-sans">
      <CardWrapper>
        <UserSettings />
      </CardWrapper>
    </div>
  );
};

export default SettingsPage;
