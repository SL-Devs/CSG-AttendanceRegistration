import React, { useContext, useEffect, useState } from "react";

import {
  Avatar,
  CircularProgress,
  Typography,
  Container,
  Button,
  Select,
  Box,
  Modal,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";
import { DataObj } from "../Utils/DataObject";
import { db } from "../firebase.config";
import { child, get, onValue, ref, update } from "firebase/database";
import { LoginContext } from "../Contexts/LoginContext";

const style = {
  position: "absolute",
  width: "auto",
  height: "auto",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  boxShadow: 24,
  p: 4,
};
const ButtonEdit = {
  color: "#00cc66",
  gap: "10px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "&:hover": {
    backgroundColor: "#00cc66",
    color: "white",
  },
};

const ButtonSx = {
  width: "200px",
  mt: "20px",
};
const TypographyHeaderSx = {
  fontSize: "16px",
  fontWeight: "700",
  mb: "20px",
  color: "#0072bb",
};

function EditModal({ id }) {
  const { setWindowLoad } = useContext(LoginContext);
  const [courseDropdownValue, setCourseDropdownValue] = useState("");
  const [yearDropdownValue, setYearDropdownValue] = useState("");
  const [dataEdit, setdataEdit] = useState([]);

  const [inputs, SetInputs] = useState({
    firstname: "",
    lastname: "",
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setWindowLoad(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !yearDropdownValue ||
      !courseDropdownValue ||
      !inputs.firstname ||
      !inputs.lastname
    ) {
      toast.error("Please fill out all fields.");
    } else {
      try {
        update(ref(db, `Users-Tertiary/${id}`), {
          firstname: inputs.firstname,
          lastname: inputs.lastname,
          course: courseDropdownValue,
          yearlevel: yearDropdownValue,
        });

        toast.success("Successfully updated");
      } catch (e) {
        console.log(e.message);
      }
    }
  };

  const onChangeInputHandle = (event) => {
    const value = event.target.value;
    SetInputs({
      ...inputs,
      [event.target.name]: value,
    });
  };

  const getSpecificUpdateData = () => {
    const dbRef = ref(db);
    get(child(dbRef, `Users-Tertiary/${id}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setdataEdit(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getSpecificUpdateData();
  }, [id]);

  const Update = () => {
    SetInputs({
      firstname: dataEdit.firstname,
      lastname: dataEdit.lastname,
    });
    setCourseDropdownValue(dataEdit.course);
    setYearDropdownValue(dataEdit.yearlevel);
    handleOpen();
  };

  return (
    <div>
      <Button onClick={Update} sx={ButtonEdit}>
        Edit Details
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Container component="main" maxWidth="xs">
          <Box component="form" noValidate onSubmit={handleSubmit} sx={style}>
            <Typography sx={TypographyHeaderSx}>Update your profile</Typography>

            <Divider sx={{ mb: "20px" }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  inputProps={{
                    style: {
                      fontSize: "14px",
                      color: "black",
                    },
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                  type="text"
                  autoComplete="given-name"
                  name="firstname"
                  required
                  fullWidth
                  id="firstname"
                  label="First name"
                  autoFocus
                  value={inputs.firstname || ""}
                  variant="outlined"
                  onChange={onChangeInputHandle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="text"
                  inputProps={{
                    style: {
                      fontSize: "14px",
                      color: "black",
                    },
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastname"
                  autoComplete="family-name"
                  variant="outlined"
                  value={inputs.lastname || ""}
                  onChange={onChangeInputHandle}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ fontSize: "14px" }}
                  >
                    Course
                  </InputLabel>
                  <Select
                    sx={{ fontSize: "14px" }}
                    variant="standard"
                    required
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Year"
                    value={courseDropdownValue}
                    onChange={(e) => setCourseDropdownValue(e.target.value)}
                  >
                    {DataObj[0].Year.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}{" "}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {courseDropdownValue && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{ fontSize: "14px" }}
                    >
                      Year level
                    </InputLabel>
                    <Select
                      sx={{ fontSize: "14px" }}
                      variant="standard"
                      required
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Year"
                      value={yearDropdownValue}
                      onChange={(e) => setYearDropdownValue(e.target.value)}
                    >
                      {DataObj[0].YearLevel.map((item) => (
                        <MenuItem value={item}>{item} </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>

            <Button type="submit" fullWidth variant="contained" sx={ButtonSx}>
              Update
            </Button>
          </Box>
        </Container>
      </Modal>
    </div>
  );
}

export default EditModal;
