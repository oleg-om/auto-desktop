const check = `<!DOCTYPE html>
<html lang="en"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Print</title><body><h1>Hello world</h1></body>`;
fs.writeFile("./temp/test.html", check, (err) => {
  if (err) {
    console.log("Error writing places", err);
  } else {
    console.log("Successfully wrote places");
  }
});
