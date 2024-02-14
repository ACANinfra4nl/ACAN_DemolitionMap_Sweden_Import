import { ListPageContent } from "@/components/ListPageContent";
import { Suspense } from "react";

export default function ListPage() {
  return (
    <Suspense>
      <ListPageContent />
    </Suspense>
  );
}
