const socket = io()
// socket.on("countUpdated",(count)=>{
//     console.log("The count has been updated!!!",count )
// })
// document.querySelector("#inc").addEventListener('click',()=>{
//     console.log("clicked")
//     socket.emit('inc')
// })

// elements
const $messageForm =document.querySelector("#msg-form")
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormButton =$messageForm.querySelector("button")
const $sendLocationButton =document.querySelector("#send-location")

socket.on("msg",(msg)=>{
    console.log(msg)
})
socket.emit('sendMsg',msg,(e)=>{
    console.log(e)
})
$messageForm.addEventListener('submit',(e)=>{
   e.preventDefault()
   $messageFormButton.setAttribute('disabled','disabled')
//    const msg =document.querySelector("msg-text").value
    const msg = e.target.elements.message.value
   socket.emit('sendMsg',msg,(error)=>{
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value=""
    // console.log('The message was delivered!!',message)
    if(error){
        return console.log(error)
    }
    console.log('message Delivered!')
   })
})

$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geoloaction is not supported by your browser')
    }
    $sendLocationButton.setAttribute("disabled","disabled")
    navigator.geolocation.getCurrentPosition((e)=>{
        // console.log(e)
        socket.emit('sendLocation',{
            latitude:e.coords.latitude,
            longitude:e.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute("disabled")
            console.log('location shared!')
        })
    })
}) 