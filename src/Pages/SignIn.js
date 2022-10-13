import React, { useState } from "react";

import CSGLOGO from "../Images/CSGLOGO.png";
import { Link, useNavigate } from "react-router-dom";
import ForgotPasswordModal from "../Components/ForgotPasswordModal";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Owl from "../Images/Owl.jpg";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  IconButton,
  Container,
  Box,
  Grid,
  TextField,
  CssBaseline,
  Button,
  Avatar,
  Paper,
} from "@mui/material";
import { auth } from "../firebase.config";
import { toast } from "react-toastify";

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
  fontSize: "13px",
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
  password: "",
};

export default function SignIn() {
  const Navigate = useNavigate();

  const [password, setPassword] = useState(false);
  const [inputs, setInputs] = useState(initialState);
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!inputs.password || !inputs.emailaddress) {
        toast.error("Please fill out all fields.");
      } else {
        const user = await signInWithEmailAndPassword(
          auth,
          inputs.emailaddress,
          inputs.password
        );

        toast.success("Login successful");
        setInputs(initialState);
        if (inputs.emailaddress === "csgdashboard@gmail.com") {
          window.location.replace("https://csg-attendance.web.app/");
        } else {
          Navigate(`qrhome/${user.user.uid}`);
        }
      }
    } catch (err) {
      if (err.message === "Firebase: Error (auth/user-not-found).") {
        toast.warning(`User not found; Please first create an account.`);
      } else {
        toast.error(err.message);
      }
      console.log(err.message);
    }
  };

  const onChangeInputHandle = (event) => {
    const value = event.target.value;
    setInputs({
      ...inputs,
      [event.target.name]: value,
    });
  };

  const togglePassword = () => {
    setPassword(!password);
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
            paddingBottom: "50px",
            marginTop: 4,
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
            Hey <span style={{ color: "yellow" }}>STI'ers </span>, Welcome 🙌.
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              inputProps={{
                style: {
                  fontSize: "14px",
                },
              }}
              InputLabelProps={{
                style: { fontSize: "14px" },
              }}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email address"
              autoComplete="email"
              autoFocus
              name="emailaddress"
              value={inputs.emailaddress || ""}
              onChange={onChangeInputHandle}
            />

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
                type={password ? "text" : "password"}
                name="password"
                value={inputs.password || ""}
                onChange={onChangeInputHandle}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePassword}
                      edge="end"
                    >
                      {password ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>

            <Button type="submit" fullWidth variant="contained" sx={Buttonsx}>
              Sign In
            </Button>
            <Grid container sx={ContainerForgetPass}>
              <Grid item>
                <ForgotPasswordModal />
              </Grid>
              <Grid item>
                <Link to="/signup">
                  <Typography sx={hoverLink}>
                    Don't have an account? Sign Up.{" "}
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        <Copyright sx={{ mt: 4, mb: 1 }} />
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

const ContainerForgetPass = (theme) => ({
  justifyContent: "space-between",
  mb: "15px",
  [theme.breakpoints.down("sm")]: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "15px",
  },
});
