


CREATE TABLE spesialis(
	id INT NOT NULL PRIMARY KEY,
	nama_spesialis VARCHAR(250)
);

CREATE TABLE dokter(
	id INT NOT NULL PRIMARY KEY,
	nama_dokter VARCHAR(250) NOT NULL,
	rumah_sakit_smid INT NOT NULL,
	spesialis_id INT NOT NULL,
	FOREIGN KEY (rumah_sakit_kode) REFERENCES rumah_sakit(smid),
	FOREIGN KEY (spesialis_id) REFERENCES spesialis(id)
);

CREATE TABLE rs_spesialis(
	id INT NOT NULL PRIMARY KEY,
	rumah_sakit_smid INT NOT NULL,
	spesialis_id INT NOT NULL,
	FOREIGN KEY (rumah_sakit_smid) REFERENCES rumah_sakit(smid),
	FOREIGN KEY (spesialis_id) REFERENCES spesialis(id)
);