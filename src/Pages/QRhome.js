import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QRCode } from "react-qrcode-logo";
import { ref, child, get, update } from "firebase/database";
import { db } from "../firebase.config";
import { LoginContext } from "../Contexts/LoginContext";
import Spinner from "../Utils/Spinner";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { signOut } from "firebase/auth";
import { auth } from "../firebase.config";

import { storage } from "../firebase.config";
import {
  CssBaseline,
  Typography,
  Container,
  Button,
  CardContent,
  CardActions,
  Card,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Box } from "@mui/system";
import { toast } from "react-toastify";
import EditModal from "../Components/EditModal";
import {
  getDownloadURL,
  uploadBytesResumable,
  ref as sRef,
} from "firebase/storage";

const ButtonLogout = {
  color: "red",
  gap: "10px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "&:hover": {
    backgroundColor: "red",
    color: "white",
  },
};

const QRhome = () => {
  const Navigate = useNavigate();
  const { windowLoad, setWindowLoad } = useContext(LoginContext);
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [imageAsset, setImageAsset] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [uploadingByte, setUploadingByte] = useState(null);

  const dbRef = ref(db);

  const getDataValue = () => {
    get(child(dbRef, `Users-Tertiary/${id}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then((res) => {
        console.log(res);
        Navigate("/");
        localStorage.clear();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (windowLoad) {
      window.location.reload(false);
    }
    getDataValue();
  }, [id, windowLoad]);

  const QRvalue = `${data.firstname}${" "}${data.lastname}${`\n`} ${
    data.course
  }${`\n`}${data.yearlevel}${`\n`} ${data.imageId}`;

  const downloadQR = () => {
    const canvas = document.getElementById("123456");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "QR.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    toast.success("QR Downloaded");
  };
  const UploadImage = (e) => {
    let file = e.target.files[0];
    // const FirstName = data.firstname;
    // const Lastname = data.lastname;
    // const Combinename = FirstName + " " + Lastname;
    const storageRef = sRef(storage, `Profile/${data.imageId}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
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
          setImageLoading(false);
          setImageAsset(downloadUrl);
          setWindowLoad(true);
          update(ref(db, `Users-Tertiary/${id}`), {
            urlLink: downloadUrl,
          });
        });
      }
    );
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        mt: "50px",
        mb: "50px",
      }}
    >
      <CssBaseline />
      <>
        <Card sx={{ maxWidth: "autp" }}>
          <Typography
            sx={{
              textAlign: "center",
              padding: "18px",
              fontSize: "15px",
              fontWeight: "500",
              color: "white",
              backgroundColor: "#0072bb",
            }}
          >
            Hey <span style={{ color: "yellow" }}>STI'ers</span> get you QR now!
          </Typography>
          <CardContent
            sx={{
              padding: "0px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Box
              item
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: "10px",
                mb: "20px",
              }}
            >
              <>
                {imageLoading ? (
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
                        {" "}
                        {uploadingByte}%{" "}
                      </Typography>
                    )}
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    {data.urlLink && (
                      <>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "black",
                            mt: "10px",
                            mb: "10px",
                            alignItems: "center",
                          }}
                        >
                          Tap to change profile picture
                        </Typography>
                        <Button
                          component="label"
                          variant="text"
                          sx={{
                            "&:hover": {
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          <Avatar
                            src={data.urlLink}
                            sx={{
                              width: 120,
                              height: 120,
                              cursor: "pointer",
                              "&:hover": {
                                opacity: "0.6",
                              },
                            }}
                          />{" "}
                          <input
                            hidden
                            accept="image/*"
                            multiple
                            type="file"
                            name="uploadimage"
                            onChange={UploadImage}
                          />
                        </Button>
                        <Typography
                          gutterBottom
                          sx={{
                            fontSize: "15px",
                            fontWeight: "500",
                            textAlign: "center",
                            color: "#0072bb",
                            mt: "5px",
                          }}
                        >
                          {data.firstname ? (
                            `Hi, ${data.firstname} 👋  `
                          ) : (
                            <Box
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <Spinner />
                            </Box>
                          )}
                        </Typography>
                      </>
                    )}{" "}
                  </>
                )}
              </>
            </Box>
          </CardContent>

          <Box
            sx={{
              display: "flex",
              justifyContent: " center",
              alignItems: "center",
              cursor: "pointer",

              mb: "10px",
            }}
            onClick={downloadQR}
          >
            <QRCode
              id="123456"
              size={200}
              bgColor="#0072bb"
              fgColor="yellow"
              value={data && QRvalue}
            />
          </Box>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "12px",
            }}
          >
            Click to download
          </Typography>
          <CardActions sx={{ justifyContent: "space-between" }}>
            <Button size="smale" onClick={handleLogout} sx={ButtonLogout}>
              Logout
              <ExitToAppIcon sx={{ fontSize: "18px" }} />
            </Button>
            <EditModal id={id} />
          </CardActions>
        </Card>
      </>
    </Container>
  );
};

export default QRhome;
