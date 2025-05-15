"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLeads } from "@/hooks/use-leads";
import { formatStatus } from "@/lib/utils";
import { Lead } from "@/types/Lead";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";
const badgeVariantsByStatus: Record<Lead['status'], "default" | "secondary"> = {
  PENDING: "default",
  REACHED_OUT: "secondary"
};

const ActionCell = ({ lead }: { lead: Lead }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { updateLead, deleteLead } = useLeads();

  const handleStatusChange = (status: string) => {
    updateLead(lead.id, { status: status as Lead['status'] });
  };

  return (
    <>
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
            onClick={() => navigator.clipboard.writeText(lead.id)}
          >
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenDialog(true)}>
            View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleStatusChange("PENDING")}>
            Mark as Pending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("REACHED_OUT")}>
            Mark as Reached Out
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (confirm("Are you sure you want to delete this lead?")) {
                deleteLead(lead.id);
              }
            }}
            className="text-red-600"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <h3 className="font-medium">Additional Information</h3>
              <p className="text-sm text-gray-500">{lead.additionalInfo || "No additional information provided"}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.firstName + " " + row.original.lastName,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "visasOfInterest",
    header: "Visas of Interest",
    cell: ({ row }) => {
      const visas = row.getValue("visasOfInterest") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {visas.map((visa) => (
            <Badge key={visa} variant="outline" className="text-xs">
              {visa}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Lead['status'];
      return (
        <Badge
          variant={badgeVariantsByStatus[status] }
        >
          {formatStatus(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Submitted
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => format(row.getValue("createdAt"), "MM/dd/yyyy, h:mm a"),
  },
  {
    accessorKey: "country",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Country
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("country") || "N/A",
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell lead={row.original} />
  },
];
