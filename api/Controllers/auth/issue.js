const db = require('../../models/database');
const path = require('path');
const insertIssueMedia = (issueId, mediaFiles) => {
  const baseUploadPath = '/uploads'; 
  const sqlInsertMedia = `INSERT INTO issues_media (issue_id, file_name, link) VALUES (?, ?, ?)`;

  mediaFiles.forEach(file => {
    const filePath = path.join(baseUploadPath, file.filename); 
    db.query(sqlInsertMedia, [issueId, file.filename, filePath], (error, results) => {
      if (error) {
        console.log('Error inserting media:', error);
      } else {
        console.log(`Media inserted for issue ID ${issueId}:`, file.filename);
      }
    });
  });
};

const submitIssue = (req, res) => {
  const mediaReceived = req.files;
  const issueDetails = req.body;

  const sqlCheckPincode = "SELECT COUNT(*) AS count FROM issues_pincode WHERE pincode = ?";

  db.query(sqlCheckPincode, [issueDetails.generatedPincode], (error, results) => {
    if (error) {
      console.error('Error checking pincode existence:', error);
      return res.status(500).send({ message: 'Error checking pincode existence' });
    }

    if (results[0].count === 0) {
     
      const sqlInsertPincode = "INSERT INTO issues_pincode (pincode, city, state) VALUES (?, ?, ?)";
      db.query(sqlInsertPincode, [issueDetails.generatedPincode, issueDetails.generatedCity, issueDetails.generatedState], (error, results) => {
        if (error) {
          console.error('Error inserting pincode:', error);
          return res.status(500).send({ message: 'Error inserting pincode' });
        }

        if (results.affectedRows > 0) {
          insertIssueDetails(res, issueDetails, mediaReceived);
        }
      });
    } else {
      insertIssueDetails(res, issueDetails, mediaReceived);
    }
  });
};

const insertIssueDetails = (res, issueDetails, mediaReceived) => {
  const currentDateTime = new Date();
  const isAnonymous = issueDetails.anonymous === 'true' || issueDetails.anonymous === true ? 1 : 0;

  const parts = issueDetails.user.trim().split(" ");
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ") || "";

  const sqlGetUserAadhar = `
    SELECT ca.citizen_id 
    FROM citizen_aadhar_number ca  
    INNER JOIN users u ON ca.citizen_id = u.email 
    WHERE u.first_name = ? AND u.last_name = ?;
  `;

  db.query(sqlGetUserAadhar, [firstName, lastName], (error, results) => {
    if (error) {
      console.error('Error finding citizen ID:', error);
      return res.status(500).send({ message: 'Error finding citizen ID' });
    }

    if (results.length > 0) {
      const citizen_id = results[0].citizen_id;

      const sqlInsertIssue = `
        INSERT INTO issues (
          citizen_id,
          title,
          issue_description,
          solution,
          category,
          issue_status,
          date_time_created,
          is_anonymous,
          date_time_submitted,
          latitude,
          longitude,
          locality,
          pincode
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(sqlInsertIssue, [
        citizen_id,
        issueDetails.title,
        issueDetails.description,
        issueDetails.suggestions,
        issueDetails.department,
        'registered',
        currentDateTime,
        isAnonymous,
        currentDateTime,
        issueDetails.latitude,
        issueDetails.longitude,
        issueDetails.generatedLocality,
        issueDetails.generatedPincode
      ], (error, results) => {
        if (error) {
          console.error('Error submitting issue:', error);
          return res.status(500).send({ message: 'Error submitting issue' });
        }

        console.log('Insert result:', results);
        const issueId = results.insertId;
        if (mediaReceived && mediaReceived.length > 0) {
          insertIssueMedia(issueId, mediaReceived);
        }
        res.status(200).send({ message: 'Upload successful' });
      });
    } else {
      console.log('Citizen ID not found for the given user.');
      res.status(404).send({ message: 'Citizen ID not found for the given user.' });
    }
  });
};

module.exports = { submitIssue };
