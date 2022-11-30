-- SELECT DATA

SELECT dokter.rumah_sakit_smid, rumah_sakit.nama, rumah_sakit.smgeometry, dokter.spesialis_id, dokter.nama_dokter, spesialis.nama_spesialis
FROM dokter, rumah_sakit, spesialis
where dokter.rumah_sakit_smid = rumah_sakit.smid and dokter.spesialis_id = spesialis.id and rumah_sakit_smid = 1

SELECT spesialis.nama_spesialis,
FROM spesialis, rs_spesialis
where spesialis.id = rs_spesialis.spesialis_id and rumah_sakit_smid = 7

SELECT * FROM rs_spesialis
WHERE rumah_sakit_smid = 7







-- WEB FILTER 
SELECT distinct rumah_sakit.nama, rumah_sakit.smid, spesialis.nama_spesialis, spesialis.id FROM dokter, rumah_sakit, spesialis where dokter.rumah_sakit_smid = rumah_sakit.smid and dokter.spesialis_id = spesialis.id order by smid, id