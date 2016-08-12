if (typeof SGI === "undefined") {
  SGI = {};
}
SGI.globalInputErrorsMessage = {
  empty: "This field can't be left empty",
  number: "This field must be a number",
  image: "Please select an image to upload",
  join: " and "
}
SGI.globalInputErrors = function(value, errorsArray) {
  if (errorsArray) {
    var errorChecks = [];
    errorsArray.map(function(error) {
      if (error === "empty" && !value.trim() ) {
        errorChecks.push(SGI.globalInputErrorsMessage[error]);
      }
      if (error === "number" && isNaN(value.trim()) ) {
        errorChecks.push(SGI.globalInputErrorsMessage[error]);
      }
      if (error === "image" && _.isEmpty(value.trim())){
        errorChecks.push(SGI.globalInputErrorsMessage[error]);
      }
    });
    return errorChecks;
  } else {
    return {message: "Please provide its possible array errors"}
  }
}
