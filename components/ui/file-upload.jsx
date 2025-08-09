"use client"
import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, FileText } from 'lucide-react';
import { Button } from './button';

export const FileUpload = ({ 
  onFileSelect, 
  maxFiles = 5, 
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx', '.txt'],
  className = ""
}) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).slice(0, maxFiles - files.length);
    
    const validFiles = newFiles.filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Max size is ${maxSize / 1024 / 1024}MB`);
        return false;
      }
      return true;
    });

    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);
    onFileSelect(updatedFiles);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFileSelect(updatedFiles);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    if (file.type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
          dragActive 
            ? 'border-teal-500 bg-teal-50' 
            : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drop files here or click to upload
        </p>
        <p className="text-sm text-gray-500">
          Max {maxFiles} files, up to {maxSize / 1024 / 1024}MB each
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Supported: {acceptedTypes.join(', ')}
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Selected Files:</h4>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-3">
                {getFileIcon(file)}
                <div>
                  <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};