

const submitIssue = (req, res) => {
  const { title, description, suggestions, department, latitude, longitude, generatedCity, generatedPincode, generatedAddress, generatedLocality, files } = req.body;
  console.log("Received text fields:", {
    title,
    description,
    suggestions,
    department,
    latitude,
    longitude,
    generatedCity,
    generatedPincode,
    generatedAddress,
    generatedLocality,
  });


  console.log("Received files:", files);


}

module.exports = { submitIssue }