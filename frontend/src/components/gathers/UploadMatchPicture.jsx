import React, { useState } from "react";
import gatherService from "../../services/gather.service";

const UploadMatchPicture = ({
  gatherId,
  setIsFinished,
  toggleShowSubmitGather,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [showComponent, setShowComponent] = useState(true);

  function handleImageChange(e) {
    const selectedFile = e.target.files[0];

    // Check if file is an image
    if (
      !selectedFile.type.startsWith("image/jpeg") &&
      !selectedFile.type.startsWith("image/png")
    ) {
      setErrorMsg("Please upload a JPEG or PNG image file.");
      return;
    }
    // Check if file size is less than 5MB
    if (selectedFile.size > 15 * 1024 * 1024) {
      setErrorMsg("File size should be less than 15MB");
      return;
    }

    // Save the selected image
    setSelectedImage(selectedFile);
    setErrorMsg("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    gatherService
      .finishGather(e, gatherId, selectedImage)
      .then(() => {
        setIsFinished((state) => !state);
        toggleShowSubmitGather();
      })
      .catch((e) => console.log(e));
    // Here, you can handle the submission of the form and upload the image
    // to your server or cloud storage
    setShowComponent(false);
    window.location.reload();
  }

  return (
    <>
      {/* <<----------------- Upload Form Here ------------------->> */}
      {showComponent && (
        <form className="card" onSubmit={handleSubmit}>
          <label>
            Select an image:
            <br />
            <input type="file" onChange={handleImageChange} />
          </label>
          {errorMsg && <div className="error">{errorMsg}</div>}
          <button
            className="btn btn-info"
            type="submit"
            disabled={!selectedImage}
          >
            Upload
          </button>
        </form>
      )}
    </>
  );
};

export default UploadMatchPicture;
