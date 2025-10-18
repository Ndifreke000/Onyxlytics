import DashboardPageLayout from "@/components/dashboard/layout"
import ContractEDA from "@/components/dashboard/eda"
import ProcessorIcon from "@/components/icons/proccesor"

export default function ContractEDAPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Contract EDA",
        description: "Exploratory Data Analysis for Solana contracts",
        icon: ProcessorIcon,
      }}
    >
      <ContractEDA />
    </DashboardPageLayout>
  )
}