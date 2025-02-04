url = "https://expert-tribble-jv7qv746jvw2v7v-3000.app.github.dev/api/v1"
const date= document.getElementById("dateInput")
const foodSelect= document.getElementById("foodSelect")
let resMessage = document.getElementById("responseMessage")

document.getElementById("EatAPI").addEventListener("submit", async function(event){
    event.preventDefault()
    try{
    const formEntires = new FormData(this)
    const eatData = Object.fromEntries(formEntires.entries())
    
    eatData.date = `${date.value}T00:00:00.000+00:00`
    sessionStorage.setItem('storedDate', date.value)
    const response = await fetch(`${url}/tracker/eat`,{
        method:"POST",
        body:JSON.stringify(eatData),
        headers:{
            'Content-Type':'application/json'
        }
    })

    if(response.ok){
        resMessage.textContent='Food Eaten ✔'
    }

    } catch(e){
        resMessage.textContent = `Error:${e.message} ✗`
    }
    sessionStorage.setItem('storedDate',date.value)
    console.log("sessionStorage.getItem('storedDate')",sessionStorage.getItem('storedDate'))
    setTimeout(()=>{location.reload()},2000)
})