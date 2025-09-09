import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage, X, File, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (file: File) => {
  if (file.type.startsWith('image/')) return <FileImage className="w-4 h-4" />;
  if (file.type === 'application/pdf') return <FileText className="w-4 h-4" />;
  return <File className="w-4 h-4" />;
};

export const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSize = 10, // 10MB default
  acceptedTypes = ['image/*', 'application/pdf', '.dwg', '.step', '.stp'],
  className
}) => {
  const { toast } = useToast();
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setIsDragActive(false);

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(({ file, errors }) => 
        `${file.name}: ${errors.map((e: any) => e.message).join(', ')}`
      ).join('\n');
      
      toast({
        title: "Vissa filer kunde inte laddas upp",
        description: errors,
        variant: "destructive"
      });
    }

    // Check total file limit
    if (files.length + acceptedFiles.length > maxFiles) {
      toast({
        title: "För många filer",
        description: `Du kan ladda upp max ${maxFiles} filer`,
        variant: "destructive"
      });
      return;
    }

    // Check file sizes
    const oversizedFiles = acceptedFiles.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "Filer för stora",
        description: `Max filstorlek är ${maxSize}MB`,
        variant: "destructive"
      });
      return;
    }

    // Add valid files
    const validFiles = acceptedFiles.filter(file => file.size <= maxSize * 1024 * 1024);
    onFilesChange([...files, ...validFiles]);
    
    if (validFiles.length > 0) {
      toast({
        title: "Filer uppladdade",
        description: `${validFiles.length} fil(er) har lagts till`
      });
    }
  }, [files, onFilesChange, maxFiles, maxSize, toast]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxSize * 1024 * 1024,
    multiple: true
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer",
          "hover:border-primary hover:bg-primary/5",
          isDragActive && "border-primary bg-primary/10 scale-105",
          isDragReject && "border-destructive bg-destructive/10",
          files.length >= maxFiles && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} disabled={files.length >= maxFiles} />
        
        <div className="flex flex-col items-center space-y-3">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
            isDragActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            {isDragReject ? (
              <AlertCircle className="w-6 h-6" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          
          <div>
            <p className="font-medium text-foreground">
              {isDragActive ? "Släpp filerna här" : "Dra och släpp filer här eller klicka för att välja"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Max {maxFiles} filer, upp till {maxSize}MB vardera
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Stöds: Bilder, PDF, CAD-filer (.dwg, .step)
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-foreground">
            Uppladdade filer ({files.length}/{maxFiles})
          </h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-muted-foreground">
                    {getFileIcon(file)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};