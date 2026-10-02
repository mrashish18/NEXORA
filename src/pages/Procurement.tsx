import DashboardLayout from "../layouts/DashboardLayout";
import ProcurementHeader from "../components/procurement/ProcurementHeader";
import PurchaseRequest from "../components/procurement/PurchaseRequest";
import AISummary from "../components/procurement/AISummary";
import ApprovalPanel from "../components/procurement/ApprovalPanel";

export default function Procurement() {
  return (
    <DashboardLayout>
      <ProcurementHeader />
      <div className="grid gap-8 xl:grid-cols-2">
        <PurchaseRequest />
        <div className="space-y-8">
          <AISummary />
          <ApprovalPanel />
        </div>
      </div>
    </DashboardLayout>
  );
}