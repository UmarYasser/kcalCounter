url = "https://97p7tnf4-3000.uks1.devtunnels.ms/api/v1"
const checkMark = '<i class="fa-solid fa-check-double fa-2xl"></i>'
const xMark ='<i class="fa-solid fa-square-xmark"></i>'
const questionMark ='<i class="fa-solid fa-question"></i>'
const gears = '<i class="fa-solid fa-gears fa-xl" ></i>'
const star = '<i class="fa-solid fa-star fa-xl"></i>'
const eye = '<i class="fa-solid fa-eye fa-2xl"></i>'
const eyeSlash = '<i class="fa-solid fa-eye-slash fa-2xl"></i>'


//Submitting Form
document.getElementById("myForm").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent form from refreshing the page or navigating away.
  const formData = new FormData(this); // Collect form data
  const data = Object.fromEntries(formData.entries()); // Convert to JSON object
  let resMessage = document.getElementById('resMessage')
  try {
     // Replace '/your-endpoint' with your actual API endpoint
      const response = await fetch(`${url}/users/setUpDiet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        resMessage.innerHTML= `${star} Directing to Tracker Page ${checkMark}`   
  
        setTimeout( ()=>{
          window.location.href = './Tracker'
        },2000)
      } else {
        document.getElementById("resMessage").innerHTML = 
          `Error: ${response.statusText} ${gears}`;
      }
    } catch (error) {
      document.getElementById("resMessage").innerHTML = 
        `Error: ${error.message} ${gears}`;
    }
});

//Days Active
document.getElementById("exer").addEventListener("input",async(event)=>{
  // "input" is the event of changing the value
  document.getElementById("daysActive").textContent = document.getElementById("exer").value
})