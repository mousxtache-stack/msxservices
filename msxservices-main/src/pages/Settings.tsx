import React from "react";
import Settings from "@/components/Settings"; // Assurez-vous que ce chemin est correct

const SettingsPage = () => {
  return (
    <div className="settings-page-container">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Settings />
      </div>
    </div>
  );
};

export default SettingsPage;
