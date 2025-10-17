import DashboardPageLayout from "@/components/dashboard/layout"
import QueryEditor from "@/components/dashboard/query-editor"
import BracketsIcon from "@/components/icons/brackets"

export default function QueryEditorPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Query Editor",
        description: "Execute custom Solana blockchain queries",
        icon: BracketsIcon,
      }}
    >
      <QueryEditor />
    </DashboardPageLayout>
  )
}
