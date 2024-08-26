export async function logSaver(logData) {
  const response = await fetch(`${process.env.SITEURL}/api/logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(logData),
  });
  const responseData = await response.json();
  if (!responseData.success) {
    console.log("Something went wrong");
    return false;
  }
  return true;
}
