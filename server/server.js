require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const db = require("./db");

app.use(cors());
app.use(express.json());
// GET ALL RUMAH SAKIT
app.get("/api/v1/rumahsakit", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM rumah_sakit");

    res.status(200).json({
      rumahsakit: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});
// GET ID NAMA ALL RUMAH SAKIT
app.get("/api/v1/rumahsakit/all", async (req, res) => {
  try {
    const results = await db.query(
      "SELECT nama as label, smid as value  FROM rumah_sakit"
    );

    res.status(200).json({
      rumahsakit: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});
// GET ALL RUMAH SAKIT - DOKTER ID - NAMA DOKTER - NAMA SPESIALIS -
app.get("/api/v1/rumahsakit/all/data", async (req, res) => {
  try {
    const results = await db.query(
      "SELECT rumah_sakit.nama, rumah_sakit.smid, dokter.nama_dokter, spesialis.nama_spesialis, dokter.id FROM dokter, rumah_sakit, spesialis where dokter.rumah_sakit_smid = rumah_sakit.smid and dokter.spesialis_id = spesialis.id  order by dokter.id desc"
    );

    res.status(200).json({
      rumahsakitAll: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

// GET ALL SPESIALIS
app.get("/api/v1/spesialis/all", async (req, res) => {
  try {
    const results = await db.query(
      "SELECT nama_spesialis as label, nama_spesialis as key FROM spesialis"
    );
    res.status(200).json({
      spesialisAll: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});
app.get("/api/v1/spesialis/allvalue", async (req, res) => {
  try {
    const results = await db.query(
      "SELECT nama_spesialis as label, nama_spesialis as value FROM spesialis"
    );
    res.status(200).json({
      spesialisAll: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});
//GET ALL RUMAH SAKIT DATA
app.get("/api/v1/rumahsakit-nama-id/all", async (req, res) => {
  try {
    const results = await db.query("SELECT smid, nama FROM rumah_sakit");
    res.status(200).json({
      rumahsakitNamaId: results.rows,
    });
  } catch (error) {}
});

//GET DOKTER - RS - SPESIALIS DATA
app.get("/api/v1/rumahsakit/:id", async (req, res) => {
  try {
    const results = await db.query(
      "SELECT rumah_sakit.nama, rumah_sakit.smid, dokter.nama_dokter,spesialis.nama_spesialis, dokter.spesialis_id, dokter.id FROM dokter, rumah_sakit, spesialis where dokter.rumah_sakit_smid = rumah_sakit.smid and dokter.spesialis_id = spesialis.id and dokter.id = $1",
      [req.params.id]
    );

    res.status(200).json({
      currentDokter: results.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

//CARI RS
app.get("/api/v1/rumahsakit/findRS/:smid", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT nama, smid from rumah_sakit WHERE smid = $1`,
      [req.params.smid]
    );
    res.status(200).json({
      data: result.rows,
    });
  } catch (error) {}
});

//QUERY SPESIALIS
app.get("/api/v1/rumahsakit/spesialis/:namaSpesialis", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT rumah_sakit.smid
      FROM dokter, rumah_sakit, spesialis
      where dokter.rumah_sakit_smid = rumah_sakit.smid 
      and dokter.spesialis_id = spesialis.id  
      and nama_spesialis = $1`,
      [req.params.namaSpesialis]
    );
    res.status(200).json({
      data: result.rows,
    });
  } catch (error) {}
});

//GET ONE RUMAH SAKIT BY ID
app.get("/api/v1/rumahsakit/:smid", async (req, res) => {
  console.log(req.params);
  try {
    const rumahsakit = await db.query(
      "SELECT * FROM rumah_sakit WHERE smid = $1",
      [req.params.smid]
    );

    const spesialis = await db.query(
      "SELECT nama_spesialis FROM rs_spesialis, spesialis WHERE rs_spesialis.spesialis_id = spesialis.id and rs_spesialis.rumah_sakit_smid = $1;",
      [req.params.smid]
    );
    console.log(spesialis);

    res.status(200).json({
      status: "success",
      data: {
        rumahsakit: rumahsakit.rows[0],
        spesialis: spesialis.rows,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

//GET SPESIALIS BY RS
app.get("/api/v1/rumahsakit/spesialis/:smid/", async (req, res) => {
  try {
    const spesialis = await db.query(
      "SELECT spesialis.nama_spesialis, spesialis.id FROM spesialis, rs_spesialis WHERE spesialis.id = rs_spesialis.spesialis_id and rumah_sakit_smid = $1;",
      [req.params.smid]
    );
    res.status(200).json({
      spesialis: spesialis.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

// ADD DOKTER
app.post("/api/v1/rumahsakit/tambah-dokter", async (req, res) => {
  try {
    const tambahDokter = await db.query(
      "INSERT INTO dokter (nama_dokter, rumah_sakit_smid, spesialis_id) VALUES ($1,$2,$3)",
      [req.body.nama_dokter, req.body.smid, req.body.spesialis_id]
    );
    res.status(204).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});

//DELETE DOKTER
app.delete("/api/v1/rumahsakit/delete-dokter/:id", async (req, res) => {
  try {
    const deleteDokter = await db.query(
      "DELETE FROM dokter where id = $1 RETURNING *",
      [req.params.id]
    );
  } catch (error) {
    console.log(error);
  }
});

//UPDATE DOKTER
app.put("/api/v1/rumahsakit/update-dokter/:id", async (req, res) => {
  try {
    const updateDokter = await db.query(
      "UPDATE dokter SET nama_dokter = $1, rumah_sakit_smid = $2, spesialis_id = $3 WHERE id = $4 RETURNING *",
      [
        req.body.nama_dokter,
        req.body.smid,
        req.body.spesialis_id,
        req.params.id,
      ]
    );
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});

console.log("nodemon works");

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`SERVER ON PORT ${port}`);
});
