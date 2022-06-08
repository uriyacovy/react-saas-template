// TODO:
// 1. Handle password contraints better according to cognito settings (type of characters, length, etc.)
// 2. Handle post password update (relogin)

import React, { useState, useCallback, useRef, useContext, Fragment } from "react";
import PropTypes from "prop-types";
import { FormHelperText, TextField, Button, Checkbox, Typography, FormControlLabel } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import FormDialog from "../../../shared/components/FormDialog";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import VisibilityPasswordTextField from "../../../shared/components/VisibilityPasswordTextField";
import { AccountContext } from "../../../shared/functions/Account";

const styles = (theme) => ({
  link: {
    transition: theme.transitions.create(["background-color"], {
      duration: theme.transitions.duration.complex,
      easing: theme.transitions.easing.easeInOut,
    }),
    cursor: "pointer",
    color: theme.palette.primary.main,
    "&:enabled:hover": {
      color: theme.palette.primary.dark,
    },
    "&:enabled:focus": {
      color: theme.palette.primary.dark,
    },
  },
});

function NewPasswordDiaglog(props) {
  const { setStatus, onClose, status } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const newPassword = useRef();
  const newPasswordRepeat = useRef();
  const { completeNewPasswordChallenge } = useContext(AccountContext);

  const updatePassword = useCallback(() => {
    if (
      newPassword.current.value !== newPasswordRepeat.current.value
    ) {
      setStatus("passwordsDontMatch");
      return;
    }
    setStatus(null);
    setIsLoading(true);
    completeNewPasswordChallenge(newPassword.current.value)
      .then((data) => {
        console.log(data);
        setStatus("passwordUpdated");
      })
      .catch((err) => {
        console.log(err);
      })
    setIsLoading(false);

    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 1500);
  }, [
    setIsLoading,
    setStatus,
    newPassword,
    newPasswordRepeat,
  ]);

  return (
    <FormDialog
      loading={isLoading}
      onClose={onClose}
      open
      headline="Please Choose a New Password"
      onFormSubmit={(e) => {
        e.preventDefault();
        updatePassword();
      }}
      hideBackdrop
      hasCloseIcon
      content={
        <Fragment>
          <VisibilityPasswordTextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={
              status === "passwordTooShort" || status === "passwordsDontMatch"
            }
            label="New Password"
            inputRef={newPassword}
            autoComplete="off"
            onChange={() => {
              if (
                status === "passwordTooShort" ||
                status === "passwordsDontMatch"
              ) {
                setStatus(null);
              }
            }}
            helperText={(() => {
              if (status === "passwordTooShort") {
                return "Create a password at least 6 characters long.";
              }
              if (status === "passwordsDontMatch") {
                return "Your passwords dont match.";
              }
              return null;
            })()}
            FormHelperTextProps={{ error: true }}
            isVisible={isPasswordVisible}
            onVisibilityChange={setIsPasswordVisible}
          />
          <VisibilityPasswordTextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={
              status === "passwordTooShort" || status === "passwordsDontMatch"
            }
            label="Repeat Password"
            inputRef={newPasswordRepeat}
            autoComplete="off"
            onChange={() => {
              if (
                status === "passwordTooShort" ||
                status === "passwordsDontMatch"
              ) {
                setStatus(null);
              }
            }}
            helperText={(() => {
              if (status === "passwordTooShort") {
                return "Create a password at least 6 characters long.";
              }
              if (status === "passwordsDontMatch") {
                return "Your passwords do not match.";
              }
            })()}
            FormHelperTextProps={{ error: true }}
            isVisible={isPasswordVisible}
            onVisibilityChange={setIsPasswordVisible}
          />
          {status === "passwordUpdated" ? (
            <HighlightedInformation>
              Your new password was updated. 
              Please login in with the new password.
            </HighlightedInformation>
          ) : (
          ""
          )}
        </Fragment>
      }
      actions={
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          color="secondary"
          disabled={isLoading}
        >
          Update Password
          {isLoading && <ButtonCircularProgress />}
        </Button>
      }
    />
  );
}

NewPasswordDiaglog.propTypes = {
//   theme: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
//   openTermsDialog: PropTypes.func.isRequired,
//   userAttributes: PropTypes.array,
  status: PropTypes.string,
  setStatus: PropTypes.func.isRequired,
//   classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(NewPasswordDiaglog);
