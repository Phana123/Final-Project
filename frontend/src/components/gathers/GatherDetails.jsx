import { useContext, useEffect, useState } from "react";
import { GatherContext } from "../../context/GatherContext";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/gather/gather-details.css";
import { Button, Col, Container, Row } from "react-bootstrap";

export default function GatherDetails() {
  const [showTeams, setShowTeams] = useState(false);
  const [item, setItem] = useState({
    _id: "",
    map: "",
    date: "",
    maxPlayers: 0,
    onGoing: false,
    players: [],
    teams: [],
    finished: false,
    score: [],
    waitingForPlayers: true,
    isUpdatedGather: false,
    __v: 0,
  });

  const { gatherId } = useParams();
  const nav = useNavigate();
  const { gatherList } = useContext(GatherContext);

  const gatherItem = gatherList.find((item) => item._id === gatherId);

  if (!gatherList) {
    // render a loading spinner or message while waiting for the data
    return <div>Loading...</div>;
  }

  if (!gatherItem) {
    // handle the case when the item is not found
    return <div>Item not found</div>;
  }

  const handleBack = () => {
    nav(-1);
  };
  const showTeamsFunction = () => {
    setShowTeams((state) => !state);
  };
  return (
    <Container className="card gather-details-container">
      <Row>
        <Col>
          <span className="my_span">
            <p className="card text-danger"> Date:</p> {gatherItem.date}
            <br />
            <hr />
          </span>
          <span className="my_span">
            Finished: {gatherItem.finished ? "Yes" : "No"}
            <br />
            <hr />
          </span>
          <span className="my_span">
            <p className="card text-danger"> Score:</p> Team A -
            {gatherItem.score[0]?.teamA} | Team B -{gatherItem.score[0]?.teamB}
            <br />
            <hr />
          </span>
          <span className="my_span">
            Map: {gatherItem?.map.toUpperCase()}
            <br />
          </span>
          <Button onClick={showTeamsFunction}>Teams</Button>{" "}
          <span className={showTeams ? "" : "hide_class"}>
            <div className="mb-1 mt-2 p-3 card bg-dark">
              <span className="   text-light h4 fs-4 fw-bolder">Team A</span>
              <br />
              {gatherItem &&
                gatherItem.teams &&
                gatherItem.teams[0] &&
                gatherItem.teams[0][0] &&
                gatherItem.teams[0][0].TeamA &&
                gatherItem.teams[0][0].TeamA.map((item) => (
                  <span className="card text-danger" key={item._id}>
                    | {item.userName} |{"   "}
                  </span>
                ))}
              <br />
              <span className="   text-light h4 fs-4 fw-bolder">Team B</span>
              <br />
              {gatherItem &&
                gatherItem.teams &&
                gatherItem.teams[0] &&
                gatherItem.teams[0][0] &&
                gatherItem.teams[0][0].TeamB &&
                gatherItem.teams[0][0].TeamB.map((item) => (
                  <span className="card text-danger" key={item._id}>
                    | {item.userName} |{"   "}
                  </span>
                ))}
            </div>
          </span>
          <Button className="my_back_btn" onClick={handleBack}>
            Back
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
