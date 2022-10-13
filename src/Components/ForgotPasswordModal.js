import * as React from "react";
import {
  Typography,
  Divider,
  Button,
  Box,
  Modal,
  TextField,
} from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase.config";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",

  p: 4,
};

const hoverLink = {
  fontSize: "13px",
  color: "#0072bb",
  "&:hover": {
    textDecoration: "underline",
  },
  cursor: "pointer",
};
export default function ForgotPasswordModal() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState(" ");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOnChange = (e) => {
    setEmail(e.target.value);
  };
  const handleForgotPassord = async () => {
    try {
      await sendPasswordResetEmail(auth, email);

      handleClose();
      toast.success("Email sent");
      setEmail("");
    } catch (e) {
      toast.error(e.message);
    }
  };
  return (
    <Box>
      <Typography onClick={handleOpen} sx={hoverLink}>
        Forgot password?
      </Typography>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            sx={{
              mb: "20px",
              fontSize: "15px",
              fontWeight: "700",
              color: "#0072bb",
            }}
          >
            Enter Email to reset new password.
          </Typography>
          <Divider />
          <TextField
            inputProps={{
              style: {
                fontSize: "14px",
              },
            }}
            InputLabelProps={{
              style: { fontSize: "14px" },
            }}
            sx={{ mt: "20px", mb: "30px" }}
            margin="normal"
            fullWidth
            id="email"
            label="Email address"
            autoComplete="email"
            autoFocus
            name="emailaddress"
            value={email}
            onChange={handleOnChange}
          />

          <Button
            variant="contained"
            type="submit"
            onClick={handleForgotPassord}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
