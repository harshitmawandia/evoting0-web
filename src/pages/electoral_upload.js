import React from "react";
import { ReactSession } from "react-client-session";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

const initialValues = {
  electionName: "",
  candidates: null, // File
  voters: null, // File
  electionDate: "",
  startTime: "",
  endTime: "",
  numVotes: 1,
};

function ElectoralUpload() {
  // clear the local storage
  ReactSession.setStoreType("sessionStorage");
  React.useEffect(() => {
    const token = ReactSession.get("access_token");
    if (token === null || token === undefined) {
      alert("Please login first");
      window.location.replace("/");
      return;
    }
  }, []);

  const navigate = useNavigate();

  const loginSchema = Yup.object().shape({
    electionName: Yup.string().required("Election Name is required"),
    electionDate: Yup.string().required("Election Date is required"),
    startTime: Yup.string().required("Start Time is required"),
    endTime: Yup.string().required("End Time is required"),
    numVotes: Yup.number().required("Number of Votes is required"),
  });

  const [data, setData] = React.useState(initialValues);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleSubmit,
    handleChange,
  } = useFormik({
    initialValues: data,

    onSubmit: (values) => {
      var formDataCandidates = new FormData();
      var formDataVoters = new FormData();
      let candidate_file = document.getElementById("candidates").files[0];
      let voter_file = document.getElementById("voters").files[0];
      console.log(candidate_file);
      console.log(voter_file);
      formDataCandidates.append("candidates", candidate_file);
      formDataVoters.append("voters", voter_file);
      let election_name = document.getElementById("name").value;
      let election_starttime = document.getElementById("starttime").value;
      let election_endtime = document.getElementById("endtime").value;
      let election_date = document.getElementById("date").value;
      let numVotes = document.getElementById("numVotes").value;
      // console.log(election_name);
      const token = ReactSession.get("access_token");
      if (token === null || token === undefined) {
        alert("Please login first");
        navigate("/", { replace: true });
        return;
      }
      // console.log(election_name)
      formDataCandidates.append("election_name", election_name);
      formDataVoters.append("election_name", election_name);

      // console.log(numVotes);

      // console.log(formDataCandidates);
      // console.log(formDataVoters);
      // if any of the fields are empty, alert the user
      if (
        election_name === "" ||
        election_starttime === "" ||
        election_endtime === "" ||
        election_date === "" ||
        candidate_file === undefined ||
        voter_file === undefined
      ) {
        alert("Please fill in all the fields");
        return;
      }
      let votes = 1;
      // if numVotes is non zero then append it to the form data
      if (
        numVotes !== 0 &&
        numVotes !== undefined &&
        numVotes !== null &&
        numVotes !== ""
      ) {
        // console.log("here");
        votes = numVotes;
      }

      let data = {
        election_name: election_name,
        startTime: election_starttime,
        endTime: election_endtime,
        date: election_date,
        votes: votes,
      };

      axios
        .post("http://10.17.5.54:8000/api/admin/createElection", data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          fetch("http://10.17.5.54:8000/api/admin/addCandidates", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formDataCandidates,
          })
            .then((response) => {
              console.log(response.data);
            })
            .catch((err) => {
              console.log(err);
              alert("Incorrect file format for candidates");
            });
          fetch("http://10.17.5.54:8000/api/admin/addElectorate", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formDataVoters,
          })
            .then((response) => {
              console.log(response.data);
            })
            .catch((err) => {
              console.log(err);
              alert("Incorrect file format for voters");
            });

          alert("Election created successfully");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          alert(err.response.data.error);
        });

      // when all functions are done, alert the user and reload the page
    },
  });

  const logout = () => {
    ReactSession.set("access_token", null);
    navigate("/", { replace: true });
  };

  const getAllElectionsResults = () => {
    const token = ReactSession.get("access_token");
    if (token === null || token === undefined) {
      alert("Please login first");
      navigate("/", { replace: true });
      return;
    }

    // get csv file of all the results

    axios
      .get("http://10.17.5.54:8000/api/admin/results", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        var blob = new Blob([res.data], { type: "text/csv" });
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "results.csv";
        link.click();
      }).catch((err) => {
        console.log(err);
        alert(err.response.data.error);
      });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div class="imgcontainer">
          <h1>ELECTORAL UPLOAD</h1>
        </div>

        <div class="container">
          <div class="row justify-content-center">
            <div class="col-4 justify-content-center align-middle">
              <label for="fname">Name of Electoral College</label>
              <br />
            </div>
            <div class="col-6 justify-content-center">
              <input
                type="text"
                id="name"
                name="name"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
              />
            </div>
          </div>
          <br />
          <br />
          <div class="row justify-content-center">
            <div class="col-7 justify-content-center">
              <label for="fname">
                Upload the list of candidates for the position
              </label>
            </div>
            <div class="col-3 justify-content-center">
              <input
                type="file"
                id="candidates"
                name="candidate_file"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.candidates}
              />
            </div>
          </div>
          <br />
          <br />
          <div class="row justify-content-center">
            <div class="col-7 justify-content-center">
              <label for="fname">
                Upload the list of voters for the position
              </label>
              <br />
            </div>
            <div class="col-3 justify-content-center">
              <input
                type="file"
                id="voters"
                name="voter_file"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.voters}
              />
            </div>
          </div>
          <br />
          <br />
          <div class="row justify-content-center">
            <div class="col-7 justify-content-center">
              <label for="date">Election Date:</label>
            </div>
            <div class="col-3 justify-content-center">
              <input
                type="date"
                id="date"
                name="date"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.date}
              />
            </div>
          </div>
          <br />
          <br />
          <div class="row justify-content-center">
            <div class="col-7 justify-content-center">
              <label for="starttime">Start Time:</label>
            </div>
            <div class="col-3 justify-content-center">
              <input
                type="time"
                id="starttime"
                name="starttime"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.starttime}
              />
            </div>
          </div>
          <br />
          <br />
          <div class="row justify-content-center">
            <div class="col-7 justify-content-center">
              <label for="endtime">End Time:</label>
            </div>
            <div class="col-3 justify-content-center">
              <input
                type="time"
                id="endtime"
                name="endtime"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.endtime}
              />
            </div>
          </div>
          <br />
          <br />
          <div class="row justify-content-center">
            <div class="col-7 justify-content-center">
              <label for="numVotes">
                Number of Votes per Voter (Default : 1)
              </label>
            </div>
            <div class="col-3 justify-content-center">
              <input
                type="number"
                id="numVotes"
                name="numVotes"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.numVotes}
              />
            </div>
          </div>
          <br />
          <br />

          <button type="submit">Create Election</button>
        </div>

        <button style={{ margin: "30px", width: "200px" }} onClick={getAllElectionsResults}>
          Get Results
        </button>

        <button style={{ margin: "30px", width: "200px" }} onClick={logout}>
          Logout
        </button>
      </form>
    </div>
  );
}

export default ElectoralUpload;
