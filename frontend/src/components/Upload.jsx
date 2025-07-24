import { useState, useEffect } from "react";
import axios from "axios";

const FileUpload = () => {
  // to manage user input file
  const [file, setFile] = useState(null);
  // to manage files fetched from database
  const [images, setImages] = useState();

  // manage file preview

  const [previewURL, setPreviewURL] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    //size validation
    const maxSizeInMB = 3;
    const maxSizeInBytes = 3 * 1024 * 1024; // max 3MB

    if (selectedFile.size > maxSizeInBytes) {
      alert(`File is too large. Max allowed size is ${maxSizeInMB} MB.`);
      return;
    }
    setFile(selectedFile);
    const preview = URL.createObjectURL(selectedFile);
    setPreviewURL(preview);
  };

  const uploadFile = async () => {
    console.log(file);
    if (!file) return alert("Please select a file");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("http://localhost:4500/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Uploaded:", res.data);
      // setImages(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const displayImage = async () => {
    const result = await axios.get("http://localhost:4500/getImage");
    console.log("images result from backend", result.data.data);
    setImages(result.data.data);
  };
  console.log("image data stored in state", images);
  useEffect(() => {
    displayImage();
  }, []);

  useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  return (
    <div className="card w-full">
      <div className="p-4 flex-1 flex flex-wrap gap-4 w-full max-w-md">
        <input
          className="border"
          type="file"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        <button onClick={uploadFile}>Upload</button>

        <div>
          <h2>File preview</h2>
          {previewURL && file && (
            <div className="preview mt-4">
              {file.type.startsWith("image/") ? (
                <img
                  src={previewURL}
                  alt="Preview"
                  style={{ maxWidth: "300px", height: "auto" }}
                />
              ) : file.type === "application/pdf" ? (
                <embed
                  src={previewURL}
                  width="300"
                  height="400"
                  type="application/pdf"
                />
              ) : (
                <p>Preview not available</p>
              )}
            </div>
          )}
        </div>
        <div>Uploaded Files:</div>
        {images &&
          images.map((file) => {
            const isPDF = file.image.endsWith(".pdf");
            return (
              <div key={file._id} className="mb-4 border">
                {isPDF ? (
                  <iframe
                    src={`http://localhost:4500/public/images/${file.image}`}
                    width="400"
                    height="400"
                  />
                ) : (
                  <img
                    src={`http://localhost:4500/public/images/${file.image}`}
                    alt="Uploaded File"
                    style={{ width: "400px" }}
                  />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default FileUpload;
