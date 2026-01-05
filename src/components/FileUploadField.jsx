import { useRef } from 'react'
import { Upload, X, File, Image } from 'lucide-react'
import { useFileUpload } from '../hooks/useFileUpload'

const FileUploadField = ({ 
  name, 
  label, 
  accept, 
  multiple = true, 
  formId, 
  register, 
  setValue,
  watch,
  helpText 
}) => {
  const fileInputRef = useRef(null)
  const { 
    uploadedFiles, 
    isUploading, 
    uploadError, 
    uploadFiles, 
    removeFile, 
    hasFiles,
    getTotalSize 
  } = useFileUpload(formId, name)

  const handleFileSelect = async (event) => {
    const files = event.target.files
    if (files && files.length > 0) {
      try {
        const result = await uploadFiles(files)
        
        // Update form data with uploaded file information
        setValue(name, uploadedFiles.map(f => ({
          id: f.id,
          name: f.originalName,
          size: f.size,
          uploaded: true
        })))
        
        // Clear the input so the same file can be selected again if needed
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } catch (error) {
        console.error('Upload failed:', error)
      }
    }
  }

  const handleRemoveFile = (fileId) => {
    removeFile(fileId)
    // Update form data
    const remainingFiles = uploadedFiles.filter(f => f.id !== fileId)
    setValue(name, remainingFiles.map(f => ({
      id: f.id,
      name: f.originalName,
      size: f.size,
      uploaded: true
    })))
  }

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'heic']
    
    return imageExtensions.includes(extension) ? Image : File
  }

  return (
    <div className="space-y-3">
      <label className="form-label">{label}</label>
      
      {/* File Input */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          {...register(name)}
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`
            w-full border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${isUploading 
              ? 'border-blue-300 bg-blue-50 cursor-not-allowed' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
            }
          `}
        >
          <Upload className={`h-8 w-8 mx-auto mb-2 ${isUploading ? 'text-blue-400' : 'text-gray-400'}`} />
          <p className={`text-sm ${isUploading ? 'text-blue-600' : 'text-gray-600'}`}>
            {isUploading ? 'Nahrávání...' : 'Klikněte nebo přetáhněte soubory'}
          </p>
          {!isUploading && (
            <p className="text-xs text-gray-500 mt-1">
              {accept ? `Podporované formáty: ${accept}` : 'Všechny formáty'}
            </p>
          )}
        </button>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">Chyba: {uploadError}</p>
        </div>
      )}

      {/* Uploaded Files List */}
      {hasFiles && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Nahrané soubory ({uploadedFiles.length})</h4>
            <span className="text-sm text-gray-600">Celkem: {getTotalSize()}</span>
          </div>
          
          <div className="space-y-2">
            {uploadedFiles.map((file) => {
              const FileIcon = getFileIcon(file.originalName)
              
              return (
                <div key={file.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <FileIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.originalName}</p>
                      <p className="text-xs text-gray-500">{file.formattedSize}</p>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(file.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Odstranit soubor"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Help Text */}
      {helpText && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  )
}

export default FileUploadField
