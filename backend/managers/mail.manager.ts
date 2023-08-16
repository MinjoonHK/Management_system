import nodemailer from "nodemailer";
import * as ics from "ics";
import ejs from "ejs";
import fs from "fs";
const transporter = nodemailer.createTransport({
  host: "smtp.keynet-hk.com",
  port: 587,
  secure: false,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "kellon",
    pass: "DsU8259a",
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

// const event: ics.EventAttributes = {
//   start: [2018, 5, 30, 6, 30],
//   duration: { hours: 6, minutes: 30 },
//   title: "Bolder Boulder",
//   description: "Annual 10-kilometer run in Boulder, Colorado",
//   location: "Folsom Field, University of Colorado (finish line)",
//   url: "http://www.bolderboulder.com/",
//   geo: { lat: 40.0095, lon: 105.2669 },
//   categories: ["10k races", "Memorial Day Weekend", "Boulder CO"],
//   status: "CONFIRMED",
//   busyStatus: "BUSY",
//   organizer: { name: "Admin", email: "Race@BolderBOULDER.com" },
//   attendees: [
//     {
//       name: "Adam Gibbons",
//       email: "adam@example.com",
//       rsvp: true,
//       partstat: "ACCEPTED",
//       role: "REQ-PARTICIPANT",
//     },
//     {
//       name: "Brittany Seaton",
//       email: "brittany@example2.org",
//       dir: "https://linkedin.com/in/brittanyseaton",
//       role: "OPT-PARTICIPANT",
//     },
//   ],
// };

export const generateRandomNumber = () => {
  var randomNumber = Math.floor(100000 + Math.random() * 900000);
  return randomNumber;
};

export const sendProjectInvitation = async (props: any & { to: string }) => {
  const ranNum = generateRandomNumber();
  let html = fs.readFileSync("./template/sendInvitation.html", "utf-8");
  Object.keys(props).forEach((key) => {
    html = html.replace(new RegExp(`{{${key}}}`, "g"), props[key]);
  });
  const info = await transporter.sendMail({
    from: `"ManageEase" <noreply@kellon.net>`, // sender address
    to: props.to, // list of receivers
    subject: `Invitation to project${ranNum}`, // Subject line
    html: html, // html body
  });
  if (info) {
    return true;
  } else {
    return false;
  }
};

export const sendAuthenticationEmail = async (to: string) => {
  const info = await transporter.sendMail({
    from: `"ManageEase" <noreply@kellon.net>`, // sender address
    to: to, // list of receivers
    subject: "Invitation to project", // Subject line
    html: fs.readFileSync("./template/sendAuthEmail.html"), // html body
  });
};

// export const sendMail = async () => {
//   let value = ics.createEvent(event);
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: '"Park👻" <noreply@kellon.net>', // sender address
//     to: "17078812D@connect.polyu.hk", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     icalEvent: {
//       filename: "invitation.ics",
//       method: "request",
//       content: value.value,
//     },
//     html: "<b>Hello ssssssssssssssss world?</b>", // html body
//   });
// };

// export const sendAuthenticationEmail = async (to: string) => {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: '"Park👻" <noreply@kellon.net>', // sender address
//     to: to, // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     icalEvent: {
//       filename: "invitation.ics",
//       method: "request",
//       content:
//         "BEGIN:VCALENDAR\r\nPRODID:-//ACME/DesktopCalendar//EN\r\nMETHOD:REQUEST\r\n...",
//     },
//     html: "<b>Hello ssssssssssssssss world?</b>", // html body
//   });
//   console.log("Message sent: %s", info.messageId);
// };
