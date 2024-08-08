import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Search from "./Search";
import AddDocument from "./AddDocument";

export default function Home() {
  return (
    <div className="p-5 flex flex-col items-center w-full">
      <div className="text-2xl m-5">
        Workflow AI Knowledge Base 📖
      </div>
    <Tabs defaultValue="search" className="w-full">
    <TabsList>
      <TabsTrigger value="search">Search</TabsTrigger>
      <TabsTrigger value="add">Add Document</TabsTrigger>
    </TabsList>
    <TabsContent value="search">
      <Search />
    </TabsContent>
    <TabsContent value="add">
      <AddDocument/>
    </TabsContent>
  </Tabs>
  </div>
  );
}
