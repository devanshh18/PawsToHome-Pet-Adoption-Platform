import nodemailer from "nodemailer";
import createError from "http-errors";
import dotenv from "dotenv";

dotenv.config();

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Test the connection
transporter.verify(function (error, success) {
  if (error) {
    console.log("Email service error: ", error);
  } else {
    console.log("Email service is ready to take our messages");
  }
});

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    /*  const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return info;*/
  } catch (error) {
    // console.error("Detaild Email error: ", error);
    throw createError(500, "Email could not be sent");
  }
};

// Send shelter status notification
export const sendShelterStatusEmail = async (
  shelterEmail,
  status,
  rejectionReason = ""
) => {
  const subject = `Shelter Registration ${
    status.charAt(0).toUpperCase() + status.slice(1)
  }`;
  let text = "";
  let html = "";

  const baseStyles = `
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333333;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  `;

  const headerStyle = `
    background-color: ${status === "approved" ? "#4CAF50" : "#f44336"};
    color: white;
    padding: 20px;
    text-align: center;
    border-radius: 5px 5px 0 0;
  `;

  const contentStyle = `
    padding: 30px 20px;
    background-color: #f8f9fa;
  `;

  const buttonStyle = `
    display: inline-block;
    padding: 12px 24px;
    background-color: ${status === "approved" ? "#4CAF50" : "#f44336"};
    color: white !important;
    text-decoration: none;
    border-radius: 4px;
    margin-top: 15px;
  `;

  if (status === "approved") {
    text =
      "Congratulations! Your shelter registration has been approved. You can now log in to your account.";
    html = `
      <div style="${baseStyles}">
        <div style="${headerStyle}">
          <h2 style="margin:0; font-size: 24px;">Registration Approved</h2>
        </div>

        <div style="${contentStyle}">
          <p style="margin: 0 0 20px 0;">Dear Shelter Administrator,</p>
          <p style="margin: 0 0 20px 0;">We are pleased to inform you that your shelter registration has been successfully approved. You can now access your account and start managing your pet listings.</p>

          <a href="${process.env.FRONTEND_URL}/login" style="${buttonStyle}">Login to Your Account</a>

          <p style="margin: 20px 0 0 0;">Best regards,<br>The Pet Adoption Team</p>
        </div>
      </div>`;
  } else if (status === "rejected") {
    text = `Your shelter registration has been rejected. Reason: ${rejectionReason}`;
    html = `
      <div style="${baseStyles}">
        <div style="${headerStyle}">
          <h2 style="margin:0; font-size: 24px;">Registration Rejected</h2>
        </div>

        <div style="${contentStyle}">
          <p style="margin: 0 0 20px 0;">Dear Shelter Administrator,</p>
          <p style="margin: 0 0 20px 0;">We regret to inform you that your shelter registration application requires modifications before it can be approved.</p>

          <div style="background-color: #fff; padding: 15px; border-left: 4px solid #f44336; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Feedback from our team:</p>
            <p style="margin: 10px 0 0 0;">${rejectionReason}</p>
          </div>

          <p style="margin: 0 0 20px 0;">Please address the concerns mentioned above and resubmit your application.</p>

          <a href="${process.env.FRONTEND_URL}/register" style="${buttonStyle}">Update Application</a>

          <p style="margin: 20px 0 0 0;">Best regards,<br>The Pet Adoption Team</p>
        </div>
      </div>`;
  }

  await sendEmail({
    to: shelterEmail,
    subject,
    text,
    html,
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const html = `
    <div style="
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    ">
      <div style="
        background-color: #2196F3;
        color: white;
        padding: 20px;
        text-align: center;
        border-radius: 5px 5px 0 0;
      ">
        <h2 style="margin:0; font-size: 24px;">Password Reset Request</h2>
      </div>

      <div style="
        padding: 30px 20px;
        background-color: #f8f9fa;
      ">
        <p style="margin: 0 0 20px 0;">We received a request to reset your password. Click the button below to proceed:</p>

        <a href="${resetUrl}" style="
          display: inline-block;
          padding: 12px 24px;
          background-color: #2196F3;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          margin: 15px 0;
        ">Reset Password</a>

        <p style="margin: 20px 0 0 0; font-size: 0.9em; color: #666;">
          If you didn't request this password reset, please ignore this email or contact our support team.
        </p>

        <p style="margin: 20px 0 0 0;">Best regards,<br>The Pet Adoption Team</p>
      </div>
    </div>`;

  const text = `You requested a password reset. Please use this link to reset your password: ${resetUrl}\n\nIf you didn't request this, please ignore this email.`;

  await sendEmail({
    to: email,
    subject: "Password Reset Request",
    text,
    html,
  });
};

export const sendApplicationConfirmation = async (userEmail) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Adoption Application Received",
    text: "Thank you for submitting your adoption application. We will review it shortly.",
  };

  await transporter.sendMail(mailOptions);
};

export const sendShelterNotification = async (shelterEmail, applicationDetails) => {
  const baseStyles = `
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333333;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  `;

  const headerStyle = `
    background-color: #2196F3;
    color: white;
    padding: 20px;
    text-align: center;
    border-radius: 5px 5px 0 0;
  `;

  const contentStyle = `
    padding: 30px 20px;
    background-color: #f8f9fa;
  `;

  const sectionStyle = `
    background-color: white;
    padding: 15px;
    margin: 10px 0;
    border-radius: 4px;
    border-left: 4px solid #2196F3;
  `;

  const html = `
    <div style="${baseStyles}">
      <div style="${headerStyle}">
        <h2 style="margin:0; font-size: 24px;">New Adoption Application Received</h2>
      </div>
      <div style="${contentStyle}">
        <p>A new adoption application has been submitted. Here are the details:</p>

        <div style="${sectionStyle}">
          <h3 style="margin-top:0">Living Arrangement</h3>
          <p>Home Type: ${applicationDetails.livingArrangement.homeType}</p>
          <p>Has Yard: ${applicationDetails.livingArrangement.hasYard ? 'Yes' : 'No'}</p>
          <p>Ownership: ${applicationDetails.livingArrangement.ownership}</p>
        </div>

        <div style="${sectionStyle}">
          <h3 style="margin-top:0">Household Information</h3>
          <p>Number of Adults: ${applicationDetails.householdInfo.numberOfAdults}</p>
          <p>Has Children: ${applicationDetails.householdInfo.hasChildren ? 'Yes' : 'No'}</p>
        </div>

        <div style="${sectionStyle}">
          <h3 style="margin-top:0">Pet Experience</h3>
          <p>Has Other Pets: ${applicationDetails.petExperience.hasOtherPets ? 'Yes' : 'No'}</p>
          <p>Previous Experience: ${applicationDetails.petExperience.previousExperience || 'None'}</p>
        </div>

        <div style="${sectionStyle}">
          <h3 style="margin-top:0">Adoption Details</h3>
          <p>Reason: ${applicationDetails.adoptionDetails.reason}</p>
          <p>Schedule: ${applicationDetails.adoptionDetails.schedule}</p>
        </div>

        <p style="margin-top:20px">Please review this application and update its status through your shelter dashboard.</p>
        <p>Best regards,<br>The Pet Adoption Team</p>
      </div>
    </div>
  `;

  const text = `
New Adoption Application Received

Living Arrangement:
- Home Type: ${applicationDetails.livingArrangement.homeType}
- Has Yard: ${applicationDetails.livingArrangement.hasYard ? 'Yes' : 'No'}
- Ownership: ${applicationDetails.livingArrangement.ownership}

Household Information:
- Number of Adults: ${applicationDetails.householdInfo.numberOfAdults}
- Has Children: ${applicationDetails.householdInfo.hasChildren ? 'Yes' : 'No'}

Pet Experience:
- Has Other Pets: ${applicationDetails.petExperience.hasOtherPets ? 'Yes' : 'No'}
- Previous Experience: ${applicationDetails.petExperience.previousExperience || 'None'}

Adoption Details:
- Reason: ${applicationDetails.adoptionDetails.reason}
- Schedule: ${applicationDetails.adoptionDetails.schedule}

Please review this application and update its status through your shelter dashboard.
  `;

  await sendEmail({
    to: shelterEmail,
    subject: "New Adoption Application",
    text,
    html
  });
};

export const sendApplicationStatus = async (userEmail, status, rejectionReason = "") => {
  const subject = `Adoption Application ${status.charAt(0).toUpperCase() + status.slice(1)}`;
  let text = "";
  let html = "";

  const baseStyles = `
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333333;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  `;

  const headerStyle = `
    background-color: ${status === "approved" ? "#4CAF50" : "#f44336"};
    color: white;
    padding: 20px;
    text-align: center;
    border-radius: 5px 5px 0 0;
  `;

  const contentStyle = `
    padding: 30px 20px;
    background-color: #f8f9fa;
  `;

  if (status === "approved") {
    text = "Congratulations! Your adoption application has been approved. The shelter will contact you soon.";
    html = `
      <div style="${baseStyles}">
        <div style="${headerStyle}">
          <h2 style="margin:0; font-size: 24px;">Application Approved</h2>
        </div>
        <div style="${contentStyle}">
          <p style="margin: 0 0 20px 0;">Dear Applicant,</p>
          <p style="margin: 0 0 20px 0;">We are pleased to inform you that your adoption application has been approved. The shelter will contact you soon to proceed with the adoption process.</p>
          <p style="margin: 20px 0 0 0;">Best regards,<br>The Pet Adoption Team</p>
        </div>
      </div>`;
  } else {
    text = `Your adoption application has been rejected.\nReason: ${rejectionReason}`;
    html = `
      <div style="${baseStyles}">
        <div style="${headerStyle}">
          <h2 style="margin:0; font-size: 24px;">Application Not Approved</h2>
        </div>
        <div style="${contentStyle}">
          <p style="margin: 0 0 20px 0;">Dear Applicant,</p>
          <p style="margin: 0 0 20px 0;">We regret to inform you that your adoption application was not approved at this time.</p>

          <div style="background-color: #fff; padding: 15px; border-left: 4px solid #f44336; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Feedback from the shelter:</p>
            <p style="margin: 10px 0 0 0;">${rejectionReason}</p>
          </div>

          <p style="margin: 0 0 20px 0;">You are welcome to apply for other pets that might be a better match for your situation.</p>
          <p style="margin: 20px 0 0 0;">Best regards,<br>The Pet Adoption Team</p>
        </div>
      </div>`;
  }

  await sendEmail({
    to: userEmail,
    subject,
    text,
    html,
  });
};