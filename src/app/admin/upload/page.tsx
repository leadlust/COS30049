"use client";
import { useState } from "react";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Navbar from "@/app/components/Header";
import Footer from "@/app/components/Footer";

interface UploadStatus {
  isUploading: boolean;
  progress: number;
  error?: string;
  success?: string;
}

export default function AdminUploadPage() {
  const [nodesFile, setNodesFile] = useState<File | null>(null);
  const [relationshipsFile, setRelationshipsFile] = useState<File | null>(null);
  const [nodesUploadStatus, setNodesUploadStatus] = useState<UploadStatus>({
    isUploading: false,
    progress: 0
  });
  const [relationshipsUploadStatus, setRelationshipsUploadStatus] = useState<UploadStatus>({
    isUploading: false,
    progress: 0
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'nodes' | 'relationships') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'nodes') setNodesFile(file);
      else setRelationshipsFile(file);
    }
  };

  const handleUpload = async (file: File | null, endpoint: string, setUploadStatus: React.Dispatch<React.SetStateAction<UploadStatus>>) => {
    if (!file) {
      setUploadStatus({ isUploading: false, progress: 0, error: "Please select a file" });
      return;
    }

    setUploadStatus({ isUploading: true, progress: 0 });

    try {
      const formData = new FormData();
      formData.append(endpoint === "/api/addresses" ? "nodes" : "relationships", file);

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setUploadStatus({ isUploading: false, progress: 100, success: "File uploaded and processed successfully" });
    } catch (error) {
      setUploadStatus({ isUploading: false, progress: 0, error: error instanceof Error ? error.message : "Upload failed" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-1 container mx-auto p-6 flex items-center justify-center">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Database Upload Management</h1>
          <div className="space-y-6">
            {/* Nodes Upload */}
            <UploadCard
              title="Nodes Upload"
              file={nodesFile}
              setFile={setNodesFile}
              uploadStatus={nodesUploadStatus}
              handleUpload={() => handleUpload(nodesFile, "/api/addresses", setNodesUploadStatus)}
            />
            {/* Relationships Upload */}
            <UploadCard
              title="Relationships Upload"
              file={relationshipsFile}
              setFile={setRelationshipsFile}
              uploadStatus={relationshipsUploadStatus}
              handleUpload={() => handleUpload(relationshipsFile, "/api/transactions", setRelationshipsUploadStatus)}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

interface UploadCardProps {
  title: string;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  uploadStatus: UploadStatus;
  handleUpload: () => void;
}

const UploadCard: React.FC<UploadCardProps> = ({ title, file, setFile, uploadStatus, handleUpload }) => {
  return (
    <Card className="bg-black border border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-white">
        <div className="space-y-4">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            id={title.replace(/\s+/g, '-').toLowerCase()}
          />
          <label
            htmlFor={title.replace(/\s+/g, '-').toLowerCase()}
            className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400"
          >
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-white">Upload {title.toLowerCase()}.csv</p>
            </div>
          </label>
          {file && <p className="text-sm text-gray-300">Selected: {file.name}</p>}
          {uploadStatus.error && (
            <Alert variant="destructive" className="bg-red-900 border-red-800">
              <AlertCircle className="h-4 w-4 text-white" />
              <AlertTitle className="text-white">Error</AlertTitle>
              <AlertDescription className="text-white">{uploadStatus.error}</AlertDescription>
            </Alert>
          )}
          {uploadStatus.success && (
            <Alert variant="default" className="bg-green-900 border-green-800">
              <CheckCircle className="h-4 w-4 text-white" />
              <AlertTitle className="text-white">Success</AlertTitle>
              <AlertDescription className="text-white">{uploadStatus.success}</AlertDescription>
            </Alert>
          )}
          {uploadStatus.isUploading && (
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadStatus.progress}%` }}></div>
            </div>
          )}
          <Button onClick={handleUpload} disabled={uploadStatus.isUploading || !file} className="w-full bg-white hover:bg-gray-100 text-black">
            {uploadStatus.isUploading ? `Uploading ${title}...` : `Upload ${title}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};