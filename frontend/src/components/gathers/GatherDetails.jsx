// GatherDetails.jsx

import { useParams } from "react-router-dom";

function GatherDetails({ gatherList }) {
  const { gatherId } = useParams();

  const selectedGatherItem = gatherList.find(
    (gatherItem) => gatherItem._id === gatherId
  );

  return (
    <div>
      <h2>{selectedGatherItem.title}</h2>
      <p>{selectedGatherItem.description}</p>
      {/* Render other details of the GatherItem as needed. */}
    </div>
  );
}

export default GatherDetails;
