import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { GatherAddFormType } from "../../@types";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ColorRing } from "react-loader-spinner";
import gatherService from "../../services/gather.service";
import isMapValid from "../../functions/checkIfStringOnArray";
import AuthContext from "../../context/AuthContext";

const maps = [
  "Ascent",
  "Split",
  "Haven",
  "Bind",
  "Icebox",
  "Breeze",
  "Fracture",
  "Pearl",
  "Lotus",
];
const GatherAdd = () => {
  const nav = useNavigate();
  //prevent double submit:
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState<string | undefined>(undefined);
  const { isLoggedIn, isAdminState, isModerator } = useContext(AuthContext);
  const [isMapValidTest, setIsMapValidTest] = useState(false);

  const initialValues = {
    map: "",
    maxPlayers: 10,
  };

  //Validations:
  const validationSchema = Yup.object({
    map: Yup.string().required(),
    maxPlayers: Yup.number().min(4).max(10),
  });

  //if all is valid=> this method is invoked
  const handleGatherAdd = (formValues: GatherAddFormType) => {
    setIsLoading(true);

    const { map, maxPlayers } = formValues;

    let MapValidTest: boolean = isMapValid(map, maps);

    gatherService
      .create(map, maxPlayers)
      .catch((e) => {
        console.log(e);

        setErrMessage(JSON.stringify(e.response.data));
      })
      .finally(() => {
        setIsLoading(false);
        nav(-1);
      });
  };
  return (
    <div>
      {errMessage && <div>${errMessage}</div>}
      {isLoading && (
        <div className="mx-auto w-25">
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{ margin: "0 auto" }}
            wrapperClass="blocks-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        </div>
      )}
      <Formik
        initialValues={initialValues}
        onSubmit={handleGatherAdd}
        validationSchema={validationSchema}
      >
        <Form className="w-50 mx-auto">
          <div>
            <label htmlFor="map" className="form-label">
              Map
            </label>
            <Field name="map" type="text" className="form-control" id="map" />
            <ErrorMessage
              name="map"
              component="div"
              className="alert alert-danger"
            />
          </div>
          <div>
            <label htmlFor="maxPlayers" className="form-label">
              Max Players
            </label>
            <Field
              name="maxPlayers"
              type="maxPlayers"
              className="form-control"
              id="maxPlayers"
            />
            <ErrorMessage
              name="maxPlayers"
              component="div"
              className="alert alert-danger"
            />
          </div>

          <div className="col-12">
            <button
              disabled={isLoading}
              className="btn btn-primary"
              type="submit"
            >
              Gather Add
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default GatherAdd;
