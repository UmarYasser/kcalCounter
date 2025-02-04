// import dotenv from 'dotenv'
// dotenv.config({path:'./config.env'})
const url = 'https://expert-tribble-jv7qv746jvw2v7v-3000.app.github.dev/api/v1'
const resMessage = document.getElementById("resMessage")

document.getElementById("logIn").addEventListener("submit",async function(event){
    event.preventDefault()
    const formEntires = new FormData(this)
    const formData = Object.fromEntries(formEntires.entries())
    
    try{
        const logFetch = await fetch(`${url}/auth/logIn`,{
            method:'POST',
            body:JSON.stringify(formData),
            headers:{
                'Content-Type':'application/json'
            }
        })
        const logResult = await logFetch.json()
    
        if(logFetch.ok){

            if(logResult.haveDiet){ resMessage.textContent= "Directing to Tracker Page ✔"}
        else {resMessage.textContent= "Directing to SetUp Page ✔"}

        console.log(logResult)
        sessionStorage.setItem("storedDate","undefined")
        setTimeout(()=>{
                if(logResult.haveDiet) {window.location.href = './Tracker'}
                else {window.location.href = './SetUp'}
        },2000)
        console.log("After setTimeout")
    }
    }catch(e){
        resMessage.textContent = `Error:${e.message} ✗`
    }
    
    
})

document.getElementById("forgotPassword").addEventListener("click",async function(event){
    event.preventDefault()
    document.getElementById('ifForgetten').hidden= false
})
document.getElementById("ifForgetten").addEventListener("submit",async function(event){  
    event.preventDefault()
    const formEnt = new FormData(this)
    const formData= Object.fromEntries(formEnt.entries())
    console.log(formData)
    try{
    const resFetch = await fetch(`${url}/auth/forgotPassword`,{
        method:'PATCH',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
    })
    const resData = await resFetch.json()
    console.log(resData)

    if(resFetch.ok){
        resMessage.textContent = "Email Sent to reset password ✔"
    }
    }catch(e){
        resMessage.textContent = `Email Not Sent: ${e.message} ✗`
    }
})
