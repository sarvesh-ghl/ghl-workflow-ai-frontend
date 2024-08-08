"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import moment from "moment";
import { deleteDocument } from "@/lib/elasticsearch";
import Swal from "sweetalert2";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type IDocument = {
  title: string;
  description: string;
  content: string;
  created_at?: string;
  updated_at?: string;
};

export type Document = IDocument & {
  id: string;
  score?: number;
};

export const columns: ColumnDef<Document>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "score",
    header: "Score",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.original.description
        .substring(0, 50)
        .concat("...");
      return (
        <Popover>
          <PopoverTrigger>
            <div className="whitespace-nowrap overflow-ellipsis overflow-hidden">
              {description}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[500px] h-[300px] overflow-auto">
            {row.original.description}
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => {
      const content = row.original.content.substring(0, 50).concat("...");
      return (
        <Popover>
          <PopoverTrigger>
            <div className="whitespace-nowrap overflow-ellipsis overflow-hidden">
              {content}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[500px] h-[300px] overflow-auto">
            <Tabs defaultValue="text" className="w-full">
              <TabsList>
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="html">HTML</TabsTrigger>
              </TabsList>
              <TabsContent value="text">{row.original.content}</TabsContent>
              <TabsContent value="html">
                <div
                  dangerouslySetInnerHTML={{ __html: row.original.content }}
                />
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.original.created_at
        ? moment(row.original.created_at).fromNow()
        : "-";
      return <div>{createdAt}</div>;
    },
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
    cell: ({ row }) => {
      const updatedAt = row.original.updated_at
        ? moment(row.original.updated_at).fromNow()
        : "-";
      return <div>{updatedAt}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const document = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(document.id)}
            >
              Copy Document ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={true}>
              View Document 🚧
            </DropdownMenuItem>
            <DropdownMenuItem disabled={true}>
              Edit Document 🚧
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-700 gap-1"
              onClick={() => deleteDocumentById(document.id)}
            >
              <TrashIcon className="w-4" /> Delete Document
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

async function deleteDocumentById(id: string) {
  // confirm deletion
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const response = await deleteDocument(id);
      if (response.result === "deleted") {
        Swal.fire("Deleted!", "Your document has been deleted.", "success");
      } else {
        Swal.fire(
          "Error!",
          "There was an error deleting the document.",
          "error"
        );
      }
    }
  });
}
