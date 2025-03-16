"use client";
import { useParams } from "next/navigation";
import DashboardContent from "@/components/dashboard/DashboardContent";

export default function AddressDashboardPage() {
  const params = useParams();
  const currentAddress = params.address as string;

  return <DashboardContent currentAddress={currentAddress} />;
}