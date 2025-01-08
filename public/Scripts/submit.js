function getCookie(name){
  const cookieObj = document.cookie.split(';')
  console.log(cookieObj)
  for (let cookie of cookieObj){
    cookie = cookie.trim()
    if(cookie.startsWith(name + '=')){
     console.log( cookie.substring(name.length+1))
      return cookie.substring(name.length+1)
    }
  }
  return null
}

document.getElementById("myForm").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent form from refreshing the page or navigating away.
    console.log("document.cookie.jwt:")
    const token = getCookie('jwt')
    console.log(token)
    const formData = new FormData(this); // Collect form data
    const data = Object.fromEntries(formData.entries()); // Convert to JSON object

    try {
      // Replace '/your-endpoint' with your actual API endpoint
      const response = await fetch('https://expert-tribble-jv7qv746jvw2v7v-3000.app.github.dev/api/v1/users/setUpDiet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `bearer ${token}`,
          credentials:'include'
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const result = await response.json();
        document.getElementById("responseMessage").textContent = 
          `Success: ${result.message || "Form submitted successfully!"}`;
      } else {
        document.getElementById("responseMessage").textContent = 
          `Error: ${response.statusText}`;
      }
    } catch (error) {
      document.getElementById("responseMessage").textContent = 
        `Error: ${error.message}`;
    }
  });  