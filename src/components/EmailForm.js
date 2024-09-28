import React, { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "./EmailForm.css";

const EmailForm = () => {
  const [emailList, setEmailList] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmails = (emails) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emails.every((email) => emailRegex.test(email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emails = emailList.split(",").map((email) => email.trim());

    if (!emailList || !subject || !body) {
      Swal.fire({
        icon: "error",
        title: "All fields are mandatory!",
        text: "Please fill out all the fields.",
      });
      return;
    }

    if (!validateEmails(emails)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email Format",
        text: "One or more email addresses are invalid.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("https://bulkmail-backend-j7aq.onrender.com/sendmail", {
        emailList: emails,
        subject: subject,
        body: body,
      });

      Swal.fire({
        icon: "success",
        title: "Emails sent successfully!",
        text: response.data.message,
      });

      setEmailList("");
      setSubject("");
      setBody("");
    } catch (error) {
      console.error("Error sending email:", error);
      Swal.fire({
        icon: "error",
        title: "Error sending email",
        text: "Something went wrong, please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">Bulk Mailer</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email List (Comma Separated):</label>
            <input
              type="text"
              className="form-control"
              value={emailList}
              onChange={(e) => setEmailList(e.target.value)}
              placeholder="Enter email addresses separated by commas"
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Subject:</label>
            <input
              type="text"
              className="form-control"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email Subject"
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Body:</label>
            <div className="km">
              <ReactQuill
                theme="snow"
                value={body}
                onChange={setBody}
                readOnly={isLoading}
                className="custom-quill-editor"
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Emails"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailForm;