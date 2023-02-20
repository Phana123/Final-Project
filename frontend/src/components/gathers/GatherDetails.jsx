import { useContext, useEffect, useState } from "react";
import { GatherContext } from "../../context/GatherContext";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/gather/gather-details.css";
import { Button, Col, Container, Row } from "react-bootstrap";

export default function GatherDetails() {
  const [showTeams, setShowTeams] = useState(false);
  const [gatherListHere, setGatherListHere] = useState();
  const { gatherId } = useParams();
  const nav = useNavigate();
  const { gatherList } = useContext(GatherContext);
  let gatherItem;
  console.log(gatherList);
  // useEffect(() => {
  //   setGatherListHere(gatherList);
  //   gatherItem = gatherListHere.find((item) => item._id === gatherId);
  // }, [gatherList]);
  // useEffect(() => {
  //   setGatherListHere(gatherList);
  // }, []);
  // const handleBack = () => {
  //   nav(-1);
  // };
  // const showTeamsFunction = () => {
  //   setShowTeams((state) => !state);
  // };
  return (
    // <Container className="card gather-details-container">
    //   <Row>
    //     <Col>
    //       <span className="my_span">
    //         Date:
    //         <br /> {gatherItem.date}
    //         <br />
    //       </span>
    //       <span className="my_span">
    //         Finished: {gatherItem.finished ? "Yes" : "No"}
    //         <br />
    //       </span>

    //       <span className="my_span">
    //         Score: {gatherItem.score}
    //         <br />
    //       </span>
    //       <span className="my_span">
    //         Map: {gatherItem.map}
    //         <br />
    //       </span>
    //       <Button onClick={showTeamsFunction}>Teams</Button>
    //       <span className={showTeams ? "" : "hide_class"}>
    //         {gatherItem.teams}
    //       </span>
    //       <Button className="my_back_btn" onClick={handleBack}>
    //         Back
    //       </Button>
    //     </Col>
    //   </Row>
    // </Container>
    <></>
  );
}
