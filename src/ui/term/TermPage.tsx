import { OperaFooter } from "@/ui/opera/sections/OperaFooter";
import { OperaHeader } from "@/ui/opera/sections/OperaHeader";
import { TermAndCond } from "./sections/TermAndCond";

export const TermPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <OperaHeader />
      <TermAndCond />
      <OperaFooter />
    </div>
  );
};
