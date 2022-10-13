import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Owl from "../Images/Owl.jpg";
import { toast } from "react-toastify";
import CSGLOGO from "../Images/CSGLOGO.png";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Avatar,
  CssBaseline,
  TextField,
  Typography,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Grid,
  Box,
  Select,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Paper,
  CircularProgress,
} from "@mui/material";
import { DataObj } from "../Utils/DataObject";
import { auth, storage } from "../firebase.config";
import { setRealtimeDatabase } from "../Utils/FirebaseFunctions";
import {
  getDownloadURL,
  uploadBytesResumable,
  ref as sRef,
  deleteObject,
} from "firebase/storage";
import { v4 as uuid } from "uuid";

function Copyright(props) {
  return (
    <>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Made by © "}
        <a
          style={{ textDecoration: "none", color: "black" }}
          href="https://www.facebook.com/SelfLearningDevs"
          target="_blank"
          rel="noreferrer"
        >
          Autoditactics
        </a>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </>
  );
}

const hoverLink = {
  mb: "20px",
  fontSize: "14px",
  color: "#0072bb",
  "&:hover": {
    textDecoration: "underline",
  },
};
const Buttonsx = {
  mt: "20px",
  mb: "30px",
  backgroundColor: "#0072bb",
  color: " white",
};

const theme = createTheme();
const initialState = {
  emailaddress: "",
  firstname: "",
  lastname: "",
  password: "",
};

export default function SignUp() {
  const unique_id = uuid();

  const Navigate = useNavigate();
  const [togglepassword, setTogglePassword] = useState(false);
  const [courseDropdownValue, setCourseDropdownValue] = useState("");
  const [yearDropdownValue, setYearDropdownValue] = useState("");
  const [imageId, setId] = useState("");
  const [inputs, SetInputs] = useState(initialState);
  const [imageAsset, setImageAsset] = useState(null);
  const [loadingImage, setImageLoading] = useState(false);
  const [uploadingByte, setUploadingByte] = useState(null);

  const togglePassword = () => {
    setTogglePassword(!togglepassword);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !yearDropdownValue ||
      !courseDropdownValue ||
      !inputs.firstname ||
      !inputs.lastname ||
      !inputs.password
    ) {
      toast.error("Please fill out all fields.");
    } else if (!imageAsset) {
      toast.error("Profile picture is necessary so that we can identify you.");
    } else {
      try {
        const user = await createUserWithEmailAndPassword(
          auth,
          inputs.emailaddress,
          inputs.password
        );

        const data = {
          id: user.user.uid,
          emailaddress: inputs.emailaddress,
          firstname: inputs.firstname,
          lastname: inputs.lastname,
          course: courseDropdownValue,
          yearlevel: yearDropdownValue,
          urlLink: imageAsset,
          imageId: imageId,
        };

        setRealtimeDatabase(data);
        toast.success("Successfully Registered");
        SetInputs(initialState);
        setCourseDropdownValue("");

        setYearDropdownValue("");
        Navigate("/");
      } catch (error) {
        toast.error(error.message);
        console.log(error.message);
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

  const UploadImage = (e) => {
    const small_id = unique_id.slice(0, 8);
    const imageFile = e.target.files[0];
    setId(small_id);
    const storageRef = sRef(storage, `Profile/${small_id}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressBar =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const roundUp = Math.trunc(progressBar);
        setImageLoading(true);
        setUploadingByte(roundUp);
      },
      (err) => {
        console.log(err);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageAsset(downloadUrl);
          setImageLoading(false);
        });
      }
    );
  };

  const DeleteImage = () => {
    const deleteRef = sRef(storage, imageAsset);
    deleteObject(deleteRef).then(() => {
      toast.success("Image deleted successfully!");
      setImageAsset(null);
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Paper
          elevation={12}
          sx={{
            borderTopLeftRadius: "100px",
            borderBottomRightRadius: "100px",
            borderTopRightRadius: "20px",
            borderBottomLeftRadius: "20px",
            padding: "25px",
            paddingBottom: "25px",
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              m: 1,
              width: "50%",
              height: "auto",
            }}
            src={CSGLOGO}
          />

          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: "500",
              color: "white",
              mt: 2,
              width: "100%",
              textAlign: "center",
              padding: "5px",
              backgroundColor: "#0072bb",
            }}
          >
            Hey <span style={{ color: "yellow" }}>STI'ers </span>, get your QR
            now 👋🏻.
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <>
                  {loadingImage ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {uploadingByte && (
                        <Typography
                          sx={{
                            fontSize: "18px",
                            fontWeight: "500",
                            color: "#0072bb",
                          }}
                        >
                          {`${uploadingByte}%`}
                        </Typography>
                      )}
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      {imageAsset ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Avatar
                            src={imageAsset}
                            alt="avatar"
                            sx={{ width: 100, height: 100 }}
                          />

                          <Button
                            sx={{
                              mt: "10px",
                              color: "red",
                            }}
                            onClick={DeleteImage}
                            startIcon={<DeleteIcon />}
                          >
                            Delete
                          </Button>
                        </Box>
                      ) : (
                        <Avatar alt="avatar" sx={{ width: 100, height: 100 }} />
                      )}{" "}
                    </>
                  )}
                </>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  inputProps={{
                    style: {
                      fontSize: "14px",
                    },
                  }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                  type="email"
                  autoComplete="given-name"
                  name="emailaddress"
                  required
                  fullWidth
                  id="emailaddress"
                  label="Email address"
                  autoFocus
                  variant="outlined"
                  value={inputs.emailaddress || ""}
                  onChange={onChangeInputHandle}
                />
              </Grid>

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
                    {DataObj[0].Year.map((item) => (
                      <MenuItem value={item}>{item} </MenuItem>
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
              <Grid item xs={12}>
                {!imageAsset && inputs.firstname && inputs.lastname && (
                  <>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        mt: "5px",
                        color: "black",
                      }}
                    >
                      Upload for profile picture
                    </Typography>
                    <Button
                      variant="contained"
                      component="label"
                      sx={{ mt: "20px", mb: "5px" }}
                    >
                      Upload
                      <input
                        hidden
                        accept="image/*"
                        multiple
                        type="file"
                        name="uploadimage"
                        onChange={UploadImage}
                      />
                    </Button>
                  </>
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ width: "100%" }} variant="outlined">
                  <InputLabel
                    htmlFor="outlined-adornment-password"
                    sx={{ fontSize: "14px" }}
                  >
                    Password
                  </InputLabel>
                  <OutlinedInput
                    required
                    fullWidth
                    id="outlined-adornment-password"
                    type={togglepassword ? "text" : "password"}
                    name="password"
                    value={inputs.password || ""}
                    onChange={onChangeInputHandle}
                    endAdornment={
                      <InputAdornment
                        position="end"
                        InputLabelProps={{ style: { fontSize: "12px" } }}
                      >
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePassword}
                          edge="end"
                        >
                          {togglepassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                  <Typography
                    sx={{
                      fontSize: "12px",
                      mt: "5px",
                      color: "black",
                    }}
                  >
                    {inputs.password.length >= 6
                      ? null
                      : "Password should be at least 6 characters."}
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={Buttonsx}>
              Sign Up
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link to="/">
                  <Typography sx={hoverLink}>
                    Already have an account? Sign in
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        <Copyright sx={{ mt: 5, mb: 1 }} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar src={Owl} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
