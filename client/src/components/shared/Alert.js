import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const Alert = ({ content, showAlert, setShowAlert, setAlert }) => {
  return (
    <Modal
      isOpen={showAlert}
      toggle={() => {
        setShowAlert(false);
        setAlert(null);
      }}
    >
      <ModalHeader>Alert</ModalHeader>
      <ModalBody>{content}</ModalBody>
    </Modal>
  );
};

Alert.propTypes = {
  content: PropTypes.string,
  showAlert: PropTypes.bool.isRequired,
  setShowAlert: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default Alert;
