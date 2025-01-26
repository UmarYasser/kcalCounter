url = "https://expert-tribble-jv7qv746jvw2v7v-3000.app.github.dev/api/v1"
function getCookie(name){
  const cookieObj = document.cookie.split(';')
  for (let cookie of cookieObj){
    cookie = cookie.trim()
    if(cookie.startsWith(name + '=')){
      return cookie.substring(name.length+1)
    }
  }
  return null
}

document.getElementById("myForm").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent form from refreshing the page or navigating away.
    const token = getCookie('jwt')
    const formData = new FormData(this); // Collect form data
    const data = Object.fromEntries(formData.entries()); // Convert to JSON object
    let resMessage = document.getElementById('responseMessage')
    try {
      // Replace '/your-endpoint' with your actual API endpoint
      const response = await fetch(`${url}/users/setUpDiet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //'authorization': `bearer ${token}`,
          //credentials:'include'
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        resMessage.textContent = "Setting Up Diet"
        const result = await response.json();
        setTimeout( ()=>{
        resMessage.textContent= 
          "Form submitted successfully! Redirecting Now"
        },2500)
        setTimeout(() =>{
          window.location.href = './Tracker'
        },5000)
      } else {
        document.getElementById("responseMessage").textContent = 
          `Error: ${response.statusText}`;
      }
    } catch (error) {
      document.getElementById("responseMessage").textContent = 
        `Error: ${error.message} ✗`;
    }
  });  