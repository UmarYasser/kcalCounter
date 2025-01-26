const devurl = 'https://expert-tribble-jv7qv746jvw2v7v-3000.app.github.dev/api/v1'
const resMessage = document.getElementById("resMessage")
const url = new URL(window.location.href)
const params = new URLSearchParams(url.search)
const token = params.get('token')


document.getElementById('ResetPassword').addEventListener('submit',async function(event){
    event.preventDefault()

    const formEnt = new FormData(this)
    const formData = Object.fromEntries(formEnt.entries())

    try{
        const resFetch = await fetch(`${devurl}/auth/resetPassword/${token}`,{
            method:'PATCH',
            headers:{
                "Content-Type":'application/json'
            },
            body:JSON.stringify(formData)
        })
        const resData = await resFetch.json()
        
        if(resFetch.ok){
            resMessage.textContent = "Password Reset ✔\nYou can now log in using the new password. This Page will close now"
            setTimeout(()=>{ window.close()},3500)
        }else{
            if(resData.message == "Invalid Token")
                resMessage.textContent = `The Token has Expired, please make a request again.. ✗`
            else
                resMessage.textContent = `Error: ${resData.message} ✗`   
        }
    }catch(e){
        resMessage.textContent = `Error:${e.message} ✗`

    }
})