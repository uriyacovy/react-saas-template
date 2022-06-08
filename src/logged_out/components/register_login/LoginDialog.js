import React, { useState, useCallback, useRef, useContext, Fragment } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import { TextField, Button, Checkbox, Typography, FormControlLabel } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import FormDialog from "../../../shared/components/FormDialog";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import VisibilityPasswordTextField from "../../../shared/components/VisibilityPasswordTextField";
import { AccountContext } from "../../../shared/functions/Account";

const styles = (theme) => ({  
  forgotPassword: {
    marginTop: theme.spacing(2),
    color: theme.palette.primary.main,
    cursor: "pointer",
    "&:enabled:hover": {
      color: theme.palette.primary.dark,
    },
    "&:enabled:focus": {
      color: theme.palette.primary.dark,
    },
  },
  disabledText: {
    cursor: "auto",
    color: theme.palette.text.disabled,
  },
  formControlLabel: {
    marginRight: 0,
  },
});

function LoginDialog(props) {
  const {
    setStatus,
    history,
    classes,
    onClose,
    openChangePasswordDialog,
    openNewPasswordDialog,
    status,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const loginEmail = useRef();
  const loginPassword = useRef();
  const { authenticate } = useContext(AccountContext);

  const login = useCallback(() => {
    setIsLoading(true);
    setStatus(null);


    authenticate(loginEmail.current.value, loginPassword.current.value)
      .then(([status, data]) => {
        console.log(status, data);
        switch (status) {
          case "newPasswordRequired":
            setIsLoading(false);
            openNewPasswordDialog();
            break;
          case "loggedIn":
            history.push("/c/dashboard");
            break;
          default:
          }
        })
      .catch(err => {
        console.error('Failed to login!', err);
        setIsLoading(false);
        setStatus("invalidEmail");
      })

    // const user = new CognitoUser({
    //   Username: loginEmail.current.value,
    //   Pool: UserPool
    // });
    // const authDetails = new AuthenticationDetails({
    //   Username: loginEmail.current.value,
    //   Password: loginPassword.current.value
    // });

    // user.authenticateUser(authDetails, {
    //   onSuccess: data => {
    //     console.log("onSuccess:", data);
    //     history.push("/c/dashboard");
    //   },

    //   onFailure: err => {
    //     console.error("onFailure:", err);
    //     setIsLoading(false);
    //     setStatus("invalidEmail");
    //   },

    //   newPasswordRequired: data => {
    //     console.log("newPasswordRequired:", data);
    //     setIsLoading(false);
    //     openNewPasswordDialog();
    //   }
    // });    

    // if (loginEmail.current.value !== "test@web.com") {
    //   setTimeout(() => {
    //     setStatus("invalidEmail");
    //     setIsLoading(false);
    //   }, 1500);
    // } else if (loginPassword.current.value !== "HaRzwc") {
    //   setTimeout(() => {
    //     setStatus("invalidPassword");
    //     setIsLoading(false);
    //   }, 1500);
    // } else {
    //   setTimeout(() => {
    //     history.push("/c/dashboard");
    //   }, 150);
    // }
  }, [setIsLoading, loginEmail, loginPassword, history, setStatus]);

  return (
    <Fragment>
      <FormDialog
        open
        onClose={onClose}
        loading={isLoading}
        onFormSubmit={(e) => {
          e.preventDefault();
          login();
        }}
        hideBackdrop
        headline="Login"
        content={
          <Fragment>
            <TextField
              variant="outlined"
              margin="normal"
              error={status === "invalidEmail"}
              required
              fullWidth
              label="Email Address"
              inputRef={loginEmail}
              autoFocus
              autoComplete="off"
              // type="email"
              type="text"
              onChange={() => {
                if (status === "invalidEmail") {
                  setStatus(null);
                }
              }}
              helperText={
                status === "invalidEmail" &&
                "This email address isn't associated with an account."
              }
              FormHelperTextProps={{ error: true }}
            />
            <VisibilityPasswordTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              error={status === "invalidPassword"}
              label="Password"
              inputRef={loginPassword}
              autoComplete="off"
              onChange={() => {
                if (status === "invalidPassword") {
                  setStatus(null);
                }
              }}
              helperText={
                status === "invalidPassword" ? (
                  <span>
                    Incorrect password. Try again, or click on{" "}
                    <b>&quot;Forgot Password?&quot;</b> to reset it.
                  </span>
                ) : (
                  ""
                )
              }
              FormHelperTextProps={{ error: true }}
              onVisibilityChange={setIsPasswordVisible}
              isVisible={isPasswordVisible}
            />
            <FormControlLabel
              className={classes.formControlLabel}
              control={<Checkbox color="primary" />}
              label={<Typography variant="body1">Remember me</Typography>}
            />
            {status === "verificationEmailSend" ? (
              <HighlightedInformation>
                We have send instructions on how to reset your password to your
                email address
              </HighlightedInformation>
            ) : (
              <HighlightedInformation>
                Email is: <b>test@web.com</b>
                <br />
                Password is: <b>HaRzwc</b>
              </HighlightedInformation>
            )}
          </Fragment>
        }
        actions={
          <Fragment>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              disabled={isLoading}
              size="large"
            >
              Login
              {isLoading && <ButtonCircularProgress />}
            </Button>
            <Typography
              align="center"
              className={classNames(
                classes.forgotPassword,
                isLoading ? classes.disabledText : null
              )}
              color="primary"
              onClick={isLoading ? null : openChangePasswordDialog}
              tabIndex={0}
              role="button"
              onKeyDown={(event) => {
                // For screenreaders listen to space and enter events
                if (
                  (!isLoading && event.keyCode === 13) ||
                  event.keyCode === 32
                ) {
                  openChangePasswordDialog();
                }
              }}
            >
              Forgot Password?
            </Typography>
          </Fragment>
        }
      />
    </Fragment>
  );
}

LoginDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired,
  openChangePasswordDialog: PropTypes.func.isRequired,
  openNewPasswordDialog: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  status: PropTypes.string,
};

export default withRouter(withStyles(styles)(LoginDialog));
