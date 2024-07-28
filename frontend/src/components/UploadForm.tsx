import React, { useState } from 'react';

interface UploadFormProps {
  onFileUpload: (file: File) => void;
  onScriptChange: (script: string) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onFileUpload, onScriptChange }) => {
  const [script, setScript] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newScript = e.target.value;
    setScript(newScript);
    onScriptChange(newScript);
  };

  return (
    <div className="w-1/3 p-4 space-y-4 border rounded-md">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="upload-pine-script">
        Upload Pine Script
      </label>
      <input
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        id="upload-pine-script"
        type="file"
        onChange={handleFileChange}
      />
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="script-textarea">
        Or paste your script here
      </label>
      <textarea
        id="script-textarea"
        className="flex h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        value={script}
        onChange={handleScriptChange}
        placeholder="Write or paste your script"
      />
    </div>
  );
};

export default UploadForm;
