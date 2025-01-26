const resMessage = document.getElementById("resMessage")

document.getElementById("SignUp").addEventListener("submit",async function(event){
    event.preventDefault()

    const formEnt = new FormData(this)
    const formData = Object.fromEntries(formEnt.entries())
    if(formData.admin == 'baba') formData.roles='admin'

    try{
        const response = await fetch(`https://expert-tribble-jv7qv746jvw2v7v-3000.app.github.dev/api/v1/auth/signUp`,{
        method:'POST',
        body:JSON.stringify(formData),
        headers:{
            'Content-Type':'application/json'
        },
    })
        if(response.ok){
            resMessage.textContent = "Signing  Up Successfully ✔"
            setTimeout(()=>{
              window.location.href= '/SetUp'
            },2000)
        }
    }catch(e){
        resMessage.textContent=`Error:${e.message} ✗`
    }
    
})