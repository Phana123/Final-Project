import React, { useState } from "react";
import { EditGatherModalType } from "../@types";

const EditGatherModal = ({ children }: EditGatherModalType) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button onClick={toggleModal}>Open Modal</button>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={toggleModal}>Close</button>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default EditGatherModal;
