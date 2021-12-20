// Simple express api with public folder
const express = require("express");
const app = express();

const path = require("path");
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;
const fs = require("fs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  express.static(path.join(__dirname, "public"), {
    index: ["index.html"],
    extensions: ["html"],
  })
);

if (!fs.existsSync("/save/dates.json")) {
  fs.writeFileSync("/save/dates.json", "[]");
}

if (!fs.existsSync("/save/deleted.json")) {
  fs.writeFileSync("/save/deleted.json", "[]");
}

let dates = JSON.parse(fs.readFileSync("/save/dates.json", "utf8"));

const addDate = (date) => {
  dates.push(date);
  fs.writeFileSync("/save/dates.json", JSON.stringify(dates));
};

const delteDate = (index) => {
  _del = dates.filter((_, idx) => idx == index);

  dates = dates.filter((_, idx) => idx != index);
  fs.writeFileSync("/save/dates.json", JSON.stringify(dates));

  deleted = JSON.parse(fs.readFileSync("/save/deleted.json", "utf8"));
  _del.forEach((d) => deleted.push(d));
  fs.writeFileSync("/save/deleted.json", JSON.stringify(deleted));
};

const createDatePage = () => {
  const datePage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Date Webiste</title>
</head>
<body>
    <link rel="stylesheet" href="style.css">

    <div class="middle">
        <button onclick="window.location.href='/';">Back</button>
        <h1>Date Receipts</h1>

        <p>Please show this is Alex to redeem your date(s)</p>

        <hr>

        ${dates
          .map(
            (date, idx) =>
              `<p>{${idx}} <b>${date.name}</b> requested a <b>${
                date.dateType
              }</b> date on <b>${date.when}</b>${
                date.notes !== ""
                  ? `<p>Here are some extra notes: </p>${date.notes}`
                  : ""
              }</p>`
          )
          .join("\n<hr>\n")}
    </div>
</body>
</html>
    `;

  return datePage;
};

const addDateIfNotAlreadyExists = (date) => {
  if (dates.some((d) => JSON.stringify(d) === JSON.stringify(date))) return;

  addDate(date);
};

app.post("/dates", (req, res) => {
  addDateIfNotAlreadyExists(req.body);

  res.send(createDatePage());
});

app.get("/dates", (_req, res) => {
  res.send(createDatePage());
});

app.get("/clear/:id", (req, res) => {
  delteDate(req.params.id);

  res.send("Success! " + req.params.id);
});

app.get("/clear", (_req, res) => {
  deleted = JSON.parse(fs.readFileSync("/save/deleted.json", "utf8"));
  dates.forEach((d) => deleted.push(d));
  fs.writeFileSync("/save/deleted.json", JSON.stringify(deleted));

  dates = [];
  res.send("Success!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
