import { OperaFooter } from "@/ui/opera/sections/OperaFooter";
import { OperaHeader } from "@/ui/opera/sections/OperaHeader";
import { PrivacyContent } from "./sections/PrivacyContent";

export const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <OperaHeader />
      <PrivacyContent />
      <OperaFooter />
    </div>
  );
};
