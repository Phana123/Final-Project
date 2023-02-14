import React, { useState } from "react";
import { EditGatherModalType } from "../@types";

const EditGatherModal = ({
  children,
  titleOpen,
  titleClose,
}: EditGatherModalType) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button onClick={toggleModal}> {titleOpen} </button>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="btn btn-light " onClick={toggleModal}>
              Close edit
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default EditGatherModal;
