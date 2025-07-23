import { useState, useEffect } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
      setImage(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const fetching = async () => {
      const res = await axios.get("http://localhost:4500/getImage");
      console.log("fetched image", res);
    };
    fetching();
  }, []);

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
      </div>
    </div>
  );
};

export default FileUpload;
