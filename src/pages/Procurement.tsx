import DashboardLayout from "../layouts/DashboardLayout";

import ProcurementHeader from "../components/procurement/ProcurementHeader";
import PurchaseRequest from "../components/procurement/PurchaseRequest";

export default function Procurement() {
  return (
    <DashboardLayout>

      <ProcurementHeader />

      <PurchaseRequest />

    </DashboardLayout>
  );
}