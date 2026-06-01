import fetch from 'node-fetch';
async function test() {
  const target = "domain:drive.google.com/thumbnail?id=1XCbsIM9C2_3ousgIcg1W5rZ3fCYdGttN&sz=w1000";
  const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent('https://drive.google.com/uc?export=view&id=1XCbsIM9C2_3ousgIcg1W5rZ3fCYdGttN')}`;
  try {
    const res = await fetch(proxyUrl);
    console.log("Status:", res.status);
    console.log("Content-Type:", res.headers.get("content-type"));
  } catch (e) {
    console.log(e);
  }
}
test();
