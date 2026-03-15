import { redirect } from "next/navigation"

export default function NewArticlePage() {
  redirect("/admin/articles/new/edit")
}
